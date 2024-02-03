import {
  ChatInputCommandSuccessPayload,
  Listener,
  Logger,
  LogLevel,
} from "@sapphire/framework";
import { writeFileSync } from "fs";

export class UserEvent extends Listener {
  public override run(interaction: ChatInputCommandSuccessPayload) {
    this.container.logger.info(
      `[/${interaction.command.name}(${interaction.command.applicationCommandRegistry?.globalCommandId})]: Ran in ${interaction.interaction.guild?.name}`,
    );

    if (process.env.NODE_ENV === "development") {
      this.saveTheRanCommandToAFile(interaction);
    }
  }

  private saveTheRanCommandToAFile(
    interaction: ChatInputCommandSuccessPayload,
  ) {
    if (interaction.interaction.user.id === "1125852865534107678") {
      writeFileSync(
        "./src/ids.txt",
        `${interaction.interaction.command?.id} ${interaction.interaction.options.getSubcommand(false)}`,
      );
    }
  }

  public override onLoad() {
    this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
    return super.onLoad();
  }
}
