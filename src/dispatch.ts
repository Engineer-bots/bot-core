import { ChatInputCommandInteraction } from "discord.js";
import { CoreContext, SlashCommand } from "./module.js";

export interface DispatchOptions<TContext extends CoreContext> {
  guildOnly?: boolean;
  // 정적 커맨드에 없을 때 동적 커맨드(DB 기반 커스텀 커맨드 등)를 처리하고 싶은 봇이 주입.
  // true를 반환하면 처리된 것으로 간주하고 종료한다.
  resolveDynamic?: (interaction: ChatInputCommandInteraction, context: TContext) => Promise<boolean>;
}

async function replyError(interaction: ChatInputCommandInteraction, message: string) {
  if (interaction.deferred || interaction.replied) {
    await interaction.followUp({ content: message, ephemeral: true });
  } else {
    await interaction.reply({ content: message, ephemeral: true });
  }
}

export async function dispatchCommand<TContext extends CoreContext>(
  interaction: ChatInputCommandInteraction,
  commands: SlashCommand<TContext>[],
  context: TContext,
  options: DispatchOptions<TContext> = {}
) {
  if (options.guildOnly !== false && !interaction.guildId) {
    await interaction.reply({ content: "이 명령어는 Discord 서버에서만 사용할 수 있습니다.", ephemeral: true });
    return;
  }

  const staticCommand = commands.find((cmd) => cmd.data.name === interaction.commandName);
  if (staticCommand) {
    try {
      await staticCommand.handle(interaction, context);
    } catch (error) {
      context.logger.error({ err: error }, "Command execution failed");
      await replyError(interaction, "명령 실행 중 오류가 발생했습니다.");
    }
    return;
  }

  if (options.resolveDynamic) {
    try {
      const handled = await options.resolveDynamic(interaction, context);
      if (handled) return;
    } catch (error) {
      context.logger.error({ err: error }, "Dynamic command execution failed");
      await replyError(interaction, "명령 실행 중 오류가 발생했습니다.");
      return;
    }
  }

  await interaction.reply({ content: "알 수 없는 명령어입니다.", ephemeral: true });
}
