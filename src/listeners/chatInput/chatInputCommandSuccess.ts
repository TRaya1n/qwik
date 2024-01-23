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
    this.saveTheRanCommandIdToAFile(interaction);
  }

  private saveTheRanCommandIdToAFile(
    interaction: ChatInputCommandSuccessPayload,
  ) {
    if (interaction.interaction.user.id === "1125852865534107678") {
      writeFileSync(
        "./src/ids.txt",
        `${interaction.command.name}: ${interaction.command.applicationCommandRegistry?.globalCommandId}`,
      );
    }
  }

  public override onLoad() {
    this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
    return super.onLoad();
  }
}
