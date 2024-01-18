import { ActivityType } from "discord.js";
import { Qwik } from "../../Qwik";
import { logger } from "../../Utils/pino-logger";
import { models } from "../../models";

export async function Event(client: Qwik, start: number) {
  logger.info(
    `Ready! ${client.user?.username} (in ${Math.floor(
      (Date.now() - start) / 1000,
    )}s)`,
  );

  const data = await models.Client.findOne({ pass: client.user?.id });

  logger.info({
    messageCommandsUsed: data?.messageCommandsRanAllTime,
    chatInputCommandUsed: data?.chatInputCommandsRanAllTime,
    userContextMenuUsed: data?.userContextMenuRanAllTime,
  });
}
