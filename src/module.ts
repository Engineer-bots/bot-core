import {
  Client,
  REST,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { Logger } from "pino";
import { BaseConfig } from "./config.js";

// 각 봇은 이 CoreContext를 extend해서 db 등 자기 필드를 추가한다.
export interface CoreContext {
  config: BaseConfig;
  logger: Logger;
  cache: Map<string, unknown>;
  client: Client;
  rest: REST;
  staticCommands: SlashCommand<any>[];
}

export interface SlashCommand<TContext extends CoreContext = CoreContext> {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  handle: (interaction: ChatInputCommandInteraction, context: TContext) => Promise<void>;
}

export interface BotModule<TContext extends CoreContext = CoreContext> {
  name: string;
  commands?: SlashCommand<TContext>[];
  register?(context: TContext): void;
}

export function loadModules<TContext extends CoreContext>(
  modules: BotModule<TContext>[],
  context: TContext
): SlashCommand<TContext>[] {
  const commands = modules.flatMap((mod) => mod.commands ?? []);
  modules.forEach((mod) => mod.register?.(context));
  return commands;
}
