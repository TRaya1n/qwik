"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingCommand = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
class PingCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
        });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => {
            return builder
                .setName("ping")
                .setDescription("Qwiks ping!")
                .addBooleanOption((option) => {
                return option
                    .setName("hide")
                    .setDescription("Hide the interaction response?")
                    .setRequired(false);
            });
        });
    }
    chatInputRun(interaction) {
        const ephemeral = interaction.options.getBoolean("hide") || false;
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
        })
            .setDescription(`\`-\` **My ping is:** ${this.container.client.ws.ping}ms`)
            .setColor("NotQuiteBlack")
            .setTimestamp();
        interaction.reply({ embeds: [embed], ephemeral });
    }
}
exports.PingCommand = PingCommand;
