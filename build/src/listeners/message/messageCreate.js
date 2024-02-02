"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageCreate = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const utils_1 = __importDefault(require("../../utils/utils"));
const guild_1 = require("../../Schema/guild");
const config_1 = require("../../config");
class MessageCreate extends framework_1.Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: framework_1.Events.MessageCreate,
        });
    }
    async run(message) {
        if (message.inGuild()) {
            const { guild } = message;
            const data = await guild_1.guilds.findOne({ id: guild.id });
            // Anti invite
            if (utils_1.default.inviteLink(message.content)) {
                if (data && data.automod && data.automod.anti_invite?.enabled) {
                    if (message.member?.permissions.has("ManageGuild" || "ManageChannels" || "ManageRoles"))
                        return;
                    const action = data.automod.anti_invite.action;
                    const embed = new discord_js_1.EmbedBuilder()
                        .setAuthor({
                        name: message.author.username,
                        iconURL: message.author.displayAvatarURL(),
                    })
                        .setDescription(`${config_1.emojis.utility.false.raw} | **Please don't send invite links to this channel, ${message.author}!**`)
                        .setColor("Red")
                        .setTimestamp();
                    let actionSuccess = false;
                    if (action === "delete") {
                        if (message.deletable) {
                            await message.delete();
                            actionSuccess = true;
                        }
                        else {
                            actionSuccess = false;
                        }
                    }
                    else if (action == "kick") {
                        message.deletable ? message.delete() : false;
                        if (message.member?.kickable) {
                            await message.member?.kick("[AutoMod]: Sent an invite link.");
                            actionSuccess = true;
                        }
                        else {
                            actionSuccess = false;
                        }
                    }
                    else if (action === "ban") {
                        message.deletable ? message.delete() : false;
                        if (message.member?.bannable) {
                            await message.member?.ban({
                                reason: `[AutoMod]: Sent an invite link.`,
                            });
                            actionSuccess = true;
                        }
                        else {
                            actionSuccess = false;
                        }
                    }
                    embed.setFooter({
                        text: `Action success: ${actionSuccess} | AutoModAntiInvite`,
                    });
                    return message.channel.send({ embeds: [embed] });
                }
            }
        }
    }
}
exports.MessageCreate = MessageCreate;
