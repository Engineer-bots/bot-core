import {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { Logger } from "pino";
import { BaseConfig } from "./config.js";

export function createDiscordClient(
  config: BaseConfig,
  intents: GatewayIntentBits[] = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: Partials[] = [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User]
) {
  const client = new Client({ intents, partials });
  const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);
  return { client, rest };
}

export async function registerCommands(
  commands: (SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder)[],
  rest: REST,
  config: BaseConfig,
  logger: Logger
) {
  const body = commands.map((cmd) => cmd.toJSON());

  if (config.COMMAND_SCOPE === "guild" && config.DISCORD_GUILD_ID) {
    logger.info({ guild: config.DISCORD_GUILD_ID, count: body.length }, "Registering guild commands");
    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, config.DISCORD_GUILD_ID),
      { body }
    );
  } else {
    logger.info({ count: body.length }, "Registering global commands");
    await rest.put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), { body });
  }
}
