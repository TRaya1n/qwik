"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelDelete = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const guild_1 = require("../../Schema/guild");
class ChannelDelete extends framework_1.Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: framework_1.Events.ChannelDelete,
        });
    }
    async run(channel) {
        const { guild } = channel;
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({
            name: guild.name,
            iconURL: guild.iconURL({ forceStatic: true }),
        })
            .setDescription(`- **Name:**\n - ${channel.name} (${channel.id})`)
            .setFooter({ text: `GuildID: ${guild.id} | ChannelDeleted` })
            .setColor("Red")
            .setTimestamp();
        const data = await guild_1.guilds.findOne({ id: guild.id });
        if (data &&
            data.log &&
            data.log.message_logging &&
            data.log.message_logging.enabled) {
            const logchannel = await guild.channels.fetch(data.log.message_logging.channel);
            if (logchannel && logchannel.isTextBased()) {
                logchannel.send({ embeds: [embed] });
            }
        }
    }
}
exports.ChannelDelete = ChannelDelete;
