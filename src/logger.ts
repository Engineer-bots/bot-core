import { pino, Logger } from "pino";

export function createLogger(options: { name: string; level: string }): Logger {
  return pino({ name: options.name, level: options.level });
}
