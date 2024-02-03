"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCommand = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const utils_1 = __importDefault(require("../../utils/utils"));
class ReportCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
        });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => {
            return builder
                .setName("report")
                .setDescription("Report an issue related to the bot.");
        });
    }
    chatInputRun(interaction) {
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId(`report`)
            .setTitle("Report an issue.");
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
            .setRequired(true)
            .setCustomId("report-issue_description")
            .setLabel("Issue Description")
            .setPlaceholder("The bot is responding very slow.")
            .setStyle(discord_js_1.TextInputStyle.Paragraph));
        const row2 = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
            .setRequired(false)
            .setCustomId("report-message_id")
            .setLabel("Bot Message link/ID")
            .setPlaceholder("An message link or an ID.")
            .setStyle(discord_js_1.TextInputStyle.Short));
        modal.setComponents(row, row2);
        interaction.showModal(modal);
        interaction
            .awaitModalSubmit({
            filter: (i) => i.customId === "report",
            time: 60000,
        })
            .then((i) => {
            if (!i.isModalSubmit())
                return;
            let method = null;
            if (process.env.REPORT_LOGS_WEBHOOK)
                method = new discord_js_1.WebhookClient({ url: process.env.REPORT_LOGS_WEBHOOK });
            const embed = this.baseEmbed(interaction);
            if (method instanceof discord_js_1.WebhookClient) {
                method.send({
                    embeds: [
                        embed
                            .setTitle(`Report in ${interaction.guild?.name} by ${interaction.user.username}`)
                            .setDescription(`- **Description:**\n - ${i.fields.getTextInputValue("report-issue_description")}\n- **Message Link/ID:**\n - ${i.fields.getTextInputValue("report-message_id")}`)
                            .setColor("Blurple"),
                    ],
                });
                return i.reply({
                    content: `${utils_1.default.emoji(true)} | **Report sent, thank you for reporting!**`,
                    ephemeral: true,
                });
            }
        })
            .catch((reason) => {
            if (reason === "time") {
                interaction.reply({
                    content: `${utils_1.default.emoji(false)} | **You didn’t submit the modal in time**`,
                    ephemeral: true,
                });
            }
        });
    }
    baseEmbed(interaction) {
        return new discord_js_1.EmbedBuilder()
            .setAuthor({
            name: interaction.user.id,
            iconURL: interaction.user.displayAvatarURL(),
        })
            .setTimestamp();
    }
}
exports.ReportCommand = ReportCommand;
