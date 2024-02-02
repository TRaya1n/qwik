"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutCommand = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
class AboutCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
        });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => {
            return builder.setName("about").setDescription("About the bot!");
        });
    }
    async chatInputRun(interaction) {
        const buttons = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId("about-me")
            .setEmoji({ id: config_1.emojis.folder.id })
            .setStyle(discord_js_1.ButtonStyle.Primary));
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
        })
            .setDescription(`# Qwik\n*Qwik is a multipurpose Discord bot, with feature's like Automod, moderation, logging & suggestions.*\n\n**Ping:** \`${this.container.client.ws.ping}ms\`\n**Developer(s):** \`${config_1.bot_config.developerNames.map((user) => user).join(", ")}\``)
            .setColor("Blurple")
            .setTimestamp();
        return interaction.reply({ embeds: [embed], components: [buttons] });
    }
}
exports.AboutCommand = AboutCommand;
