"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonHandler = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const discord_js_utilities_1 = require("@sapphire/discord.js-utilities");
class ButtonHandler extends framework_1.InteractionHandler {
    constructor(context, options) {
        super(context, {
            ...options,
            interactionHandlerType: framework_1.InteractionHandlerTypes.Button,
        });
    }
    async run(interaction) {
        if (interaction.customId === "about-me")
            return await this.about_me(interaction);
    }
    async about_me(interaction) {
        const page = new discord_js_utilities_1.PaginatedMessage({
            template: new discord_js_1.EmbedBuilder()
                .setColor("Blurple")
                .setTimestamp()
                .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            }),
        });
        const MODERATION_DESCRIPTION = `# Moderation\n- *Qwik v2 has new moderation feature's!*\n\n</moderation nickname:1199648228438712321>\n- **Change the specified members nickname.**\n - \`<nickname>\`: **The nickname to give this member. (max 32 characters)**\n - \`[hide]\`: **Hide the response from the interaction**\n\n</moderation kick:1199648228438712321>\n- **Kick the specified member from this server.**\n - \`<member>\`: **The member to kick from this guild**\n - \`[reason]\`: **The reason for kicking this member from this guild. (max 35 characters)**\n\n</moderation ban:1199648228438712321>\n- **Ban the specified member from this server**\n - \`<member>\`: **The member to ban**\n - \`[reason]\`: **The reason for banning this member**`;
        const CONFIG = {
            header: "# Config\n",
            extra_information: "- *Qwik v2 has new configure commands!*\n\n",
            commands_logging_message: `</config logging message:1200847772094582804>\n- **Configure the message log channel.**\n - \`<enabled>\`: **Enable/Disable this module.**\n - \`<channel>\`: **The channel to log message updates.**\n\n`,
            commands_logging_channel: `<config logging channel:1200847772094582804>\n- **Configure the channel log channel.**\n - \`<enabled>\`: **Enable/Disable this module.**\n - \`<channel\`: **The channel to log channel updates.**\n\n`,
        };
        page
            .addPageEmbed((embed) => embed.setDescription(MODERATION_DESCRIPTION))
            .addPageEmbed((embed) => embed.setDescription(`${CONFIG.header}${CONFIG.extra_information}${CONFIG.commands_logging_message}${CONFIG.commands_logging_channel}`));
        try {
            await interaction.deferUpdate();
            return await page.run(interaction, interaction.user);
        }
        catch (error) {
            this.container.logger.fatal(error);
        }
    }
}
exports.ButtonHandler = ButtonHandler;
