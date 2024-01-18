import { resolve } from "path";
import { logger } from "../Utils/pino-logger";
import { Qwik } from ".";

interface QwikButtonOptions {
  client: Qwik;
  path: string;
}

class QwikButton {
  public constructor(options: QwikButtonOptions) {
    this.init(options);
  }

  private init({ client, path }: QwikButtonOptions) {
    client?.on("interactionCreate", (interaction) => {
      if (!interaction.isButton()) return;
      try {
        const customId = interaction.customId.split("-");
        if (customId[0].startsWith("collector")) return;

        const file = require(resolve(path, customId[0], customId[1]));
        file.Buttons(interaction, client, customId);
      } catch (error) {
        logger.error(error, "QwikButtonError");
      }
    });
  }
}

export { QwikButton };
