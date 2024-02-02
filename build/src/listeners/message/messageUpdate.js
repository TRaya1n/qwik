"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageUpdate = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const utils_1 = __importDefault(require("../../utils/utils"));
const guild_1 = require("../../Schema/guild");
class MessageUpdate extends framework_1.Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: framework_1.Events.MessageUpdate,
        });
    }
    async run(oldMessage, message) {
        if (!message.inGuild())
            return;
        if (message.author.bot)
            return;
        if (message.partial)
            await message.fetch().catch(this.container.logger.error);
        if (oldMessage.partial)
            await oldMessage.fetch().catch(this.container.logger.error);
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL(),
        })
            .setDescription(`> **[Jump to message](${message.url})**`)
            .addFields({
            name: "**New:**",
            value: `${utils_1.default.checkCharLimit(message.content, 1024)}`,
        }, {
            name: "**Old:**",
            value: `${utils_1.default.checkCharLimit(message.content, 1024)}`,
        })
            .setColor("Orange")
            .setFooter({ text: `GuildID: ${message.guildId} | MessageUpdated` })
            .setTimestamp();
        const data = await guild_1.guilds.findOne({ id: message.guildId });
        if (data && data.log && data.log.message_logging) {
            if (data.log.message_logging.enabled) {
                const channel = await message.guild.channels.fetch(data.log.message_logging.channel);
                if (channel && channel.isTextBased()) {
                    channel.send({ embeds: [embed] });
                }
            }
        }
    }
}
exports.MessageUpdate = MessageUpdate;
