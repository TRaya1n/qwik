"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvent = void 0;
const framework_1 = require("@sapphire/framework");
const fs_1 = require("fs");
class UserEvent extends framework_1.Listener {
    run(interaction) {
        this.container.logger.info(`[/${interaction.command.name}(${interaction.command.applicationCommandRegistry?.globalCommandId})]: Ran in ${interaction.interaction.guild?.name}`);
        this.saveTheRanCommandToAFile(interaction);
    }
    saveTheRanCommandToAFile(interaction) {
        if (interaction.interaction.user.id === "1125852865534107678") {
            (0, fs_1.writeFileSync)("./src/ids.txt", `${interaction.interaction.command?.id} ${interaction.interaction.options.getSubcommand(false)}`);
        }
    }
    onLoad() {
        this.enabled = this.container.logger.level <= framework_1.LogLevel.Debug;
        return super.onLoad();
    }
}
exports.UserEvent = UserEvent;
