import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

export const baseEnvSchema = z.object({
  DISCORD_TOKEN: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  COMMAND_SCOPE: z.enum(["global", "guild"]),
  DISCORD_GUILD_ID: z.string().optional(),
  LOG_LEVEL: z.string().default("info"),
});

export type BaseConfig = z.infer<typeof baseEnvSchema>;

// 각 봇은 baseEnvSchema.extend({...})로 자기 필드(DATABASE_URL 등)를 얹어서 넘긴다.
export function loadConfig<Schema extends z.ZodType<BaseConfig>>(
  schema: Schema
): z.infer<Schema> {
  const parsed = schema.parse(process.env);
  if (parsed.COMMAND_SCOPE === "guild" && !parsed.DISCORD_GUILD_ID) {
    throw new Error("COMMAND_SCOPE is 'guild' but DISCORD_GUILD_ID is missing");
  }
  return parsed;
}
