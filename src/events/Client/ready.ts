import { ActivityType } from "discord.js";
import { Qwik } from "../../Qwik";
import { logger } from "../../Utils/pino-logger";

export async function Event(client: Qwik, start: number) {
  logger.info(
    `Ready! ${client.user?.username} (in ${Math.floor(
      (Date.now() - start) / 1000,
    )}s)`,
  );
}
