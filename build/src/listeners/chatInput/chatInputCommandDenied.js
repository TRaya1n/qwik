"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvent = void 0;
const framework_1 = require("@sapphire/framework");
class UserEvent extends framework_1.Listener {
    async run({ context, message: content }, { interaction }) {
        // `context: { silent: true }` should make UserError silent:
        // Use cases for this are for example permissions error when running the `eval` command.
        if (Reflect.get(Object(context), "silent"))
            return;
        if (interaction.deferred || interaction.replied) {
            return interaction.editReply({
                content,
                allowedMentions: { users: [interaction.user.id], roles: [] },
            });
        }
        return interaction.reply({
            content,
            allowedMentions: { users: [interaction.user.id], roles: [] },
            ephemeral: true,
        });
    }
}
exports.UserEvent = UserEvent;
