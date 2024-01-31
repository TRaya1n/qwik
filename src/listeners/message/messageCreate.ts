import { Events, Listener } from "@sapphire/framework";
import { EmbedBuilder, InteractionCollector, Message } from "discord.js";
import utils from "../../utils/utils";
import { guilds } from "../../Schema/guild";
import { emojis } from "../../config";

export class MessageCreate extends Listener {
  public constructor(
    context: Listener.LoaderContext,
    options: Listener.Options,
  ) {
    super(context, {
      ...options,
      event: Events.MessageCreate,
    });
  }

  public override async run(message: Message) {
    if (message.inGuild()) {
      const { guild } = message;

      const data = await guilds.findOne({ id: guild.id });

      // Anti invite
      if (utils.inviteLink(message.content)) {
        if (data && data.automod && data.automod.anti_invite?.enabled) {
          //if (message.member?.permissions.has('ManageGuild' || 'ManageChannels' || "ManageRoles")) return;
          const action = data.automod.anti_invite.action;
          const embed = new EmbedBuilder()
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL(),
            })
            .setDescription(
              `${emojis.utility.false.raw} | **Please don't send invite links to this channel, ${message.author}!**`,
            )
            .setColor("Red")
            .setTimestamp();

          let actionSuccess = false;
          if (action === "delete") {
            if (message.deletable) {
              await message.delete();
              actionSuccess = true;
            } else {
              actionSuccess = false;
            }
          } else if (action == "kick") {
            message.deletable ? message.delete() : false;
            if (message.member?.kickable) {
              await message.member?.kick("[AutoMod]: Sent an invite link.");
              actionSuccess = true;
            } else {
              actionSuccess = false;
            }
          } else if (action === "ban") {
            message.deletable ? message.delete() : false;
            if (message.member?.bannable) {
              await message.member?.ban({
                reason: `[AutoMod]: Sent an invite link.`,
              });
              actionSuccess = true;
            } else {
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
