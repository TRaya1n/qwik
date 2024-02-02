"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeLog = void 0;
const framework_1 = require("@sapphire/framework");
const package_json_1 = require("../../../package.json");
const changelogs_json_1 = __importDefault(require("../../../changelogs.json"));
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../../config"));
class ChangeLog extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
        });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => {
            return builder
                .setName("changelog")
                .setDescription("View the change log!")
                .setDMPermission(false);
        });
    }
    async chatInputRun(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setStyle(discord_js_1.ButtonStyle.Link)
            .setURL(package_json_1.repository)
            .setLabel("Github")
            .setEmoji(config_1.default.emojis.apps.github.raw));
        const commandsAddedFormated = changelogs_json_1.default.LATEST.commands_added
            .map((value) => `</${value.name}:${value.id}>\n- ${value.description}`)
            .join("\n\n");
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({
            name: this.container.client.user?.username,
            iconURL: this.container.client.user?.displayAvatarURL(),
        })
            .setDescription(`${changelogs_json_1.default.LATEST.header}\n${changelogs_json_1.default.LATEST.it_information}\n\n${commandsAddedFormated}\n\n**Audit log events::**`)
            .setFooter({ text: `${changelogs_json_1.default.LATEST.version}` })
            .setTimestamp()
            .setColor("Blurple");
        changelogs_json_1.default.LATEST.events_added.adds.forEach((value) => embed.addFields({ name: `${value.name}`, value: `${value.description}` }));
        interaction.editReply({ embeds: [embed], components: [row] });
    }
}
exports.ChangeLog = ChangeLog;
