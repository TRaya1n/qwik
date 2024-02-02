"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelUpdate = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const guild_1 = require("../../Schema/guild");
class ChannelUpdate extends framework_1.Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: framework_1.Events.ChannelUpdate,
        });
    }
    async run(oldChannel, channel) {
        const { guild } = channel;
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
            .setTimestamp()
            .setColor("Orange");
        if (oldChannel.name != channel.name) {
            sendToLogChannel(embed
                .setDescription(`- **Name**\n - ${oldChannel.name} -> **${channel.name}**`)
                .setFooter({ text: `GuildID: ${guild.id} | ChannelNameChanged` }));
        }
        async function sendToLogChannel(embed) {
            const data = await guild_1.guilds.findOne({ id: guild.id });
            if (data &&
                data.log &&
                data.log.channel_logging &&
                data.log.channel_logging.enabled) {
                const channel = await guild.channels.fetch(data.log.channel_logging.channel);
                if (channel && channel.isTextBased()) {
                    channel.send({ embeds: [embed] });
                }
            }
        }
    }
}
exports.ChannelUpdate = ChannelUpdate;
