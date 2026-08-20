import { ActivityType } from "discord.js";
import { CoreContext } from "./module.js";

const activityTypeMap: Record<string, ActivityType> = {
  PLAYING: ActivityType.Playing,
  WATCHING: ActivityType.Watching,
  LISTENING: ActivityType.Listening,
};

export function isPresenceController(
  config: Pick<CoreContext["config"], "DISCORD_GUILD_ID">,
  guildId: string | null
): boolean {
  return !!config.DISCORD_GUILD_ID && config.DISCORD_GUILD_ID === guildId;
}

export function setBotPresence(
  context: Pick<CoreContext, "client">,
  activityType?: string | null,
  activityText?: string | null,
  defaultText = "watching"
) {
  context.client.user?.setPresence({
    activities: [{
      name: activityText || defaultText,
      type: activityTypeMap[activityType ?? ""] ?? ActivityType.Watching,
    }],
    status: "online",
  });
}
