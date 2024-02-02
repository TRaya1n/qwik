"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDelete = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const utils_1 = __importDefault(require("../../utils/utils"));
const guild_1 = require("../../Schema/guild");
class MessageDelete extends framework_1.Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: framework_1.Events.MessageDelete,
        });
    }
    async run(message) {
        if (!message.inGuild())
            return;
        const { guild, author } = message;
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: author.username, iconURL: author.displayAvatarURL() })
            .setColor("Red")
            .setFooter({ text: `GuildID:  ${guild.id} | MessageDeleted` })
            .setTimestamp();
        if (message.embeds[0] && message.embeds[0].description) {
            if (author.id === this.container.client.user?.id)
                return;
            embed.setDescription(`${utils_1.default.checkCharLimit(message.embeds[0].description, 4096)}`);
        }
        else {
            embed.setDescription(`${utils_1.default.checkCharLimit(message.content, 4096)}`);
        }
        const data = await guild_1.guilds.findOne({ id: guild?.id });
        if (data && data.log && data.log.message_logging) {
            if (data.log.message_logging.enabled) {
                const channel = guild?.channels.cache.get(data.log.message_logging.channel);
                if (channel && channel.isTextBased()) {
                    channel.send({ embeds: [embed] });
                }
            }
        }
    }
}
exports.MessageDelete = MessageDelete;
