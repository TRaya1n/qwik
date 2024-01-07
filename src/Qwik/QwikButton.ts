import { ButtonInteraction } from "discord.js";
import { Qwik } from ".";
import { QwikButtonOptions } from "./interfaces/QwikButtonOptions";
import { readdirSync } from "fs";
import { resolve } from "path";

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
        console.error("[BUTTON] Error:");
        console.debug(error);
      }
    });
  }
}

export { QwikButton };
