import { Command } from "@sapphire/framework";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";
import { EmbedBuilder } from "discord.js";

export class AboutCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) => {
      return builder
        .setName("about")
        .setDescription(`About me!`)
    });
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction,
  ) {
    const page = new PaginatedMessage({
      template: new EmbedBuilder()
        .setColor("Blurple")
        .setTimestamp()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        }),
    });

    const MODERATION_DESCRIPTION: string = `# Moderation\n- *Qwik v2 has new moderation feature's!*\n\n</moderation nickname:1199648228438712321>\n- **Change the specified members nickname.**\n - \`<nickname>\`: **The nickname to give this member. (max 32 characters)**\n - \`[hide]\`: **Hide the response from the interaction**\n\n</moderation kick:1199648228438712321>\n- **Kick the specified member from this server.**\n - \`<member>\`: **The member to kick from this guild**\n - \`[reason]\`: **The reason for kicking this member from this guild. (max 35 characters)**\n\n</moderation ban:1199648228438712321>\n- **Ban the specified member from this server**\n - \`<member>\`: **The member to ban**\n - \`[reason]\`: **The reason for banning this member**`;
    //const ADMIN_DESCRIPTION: string = "";

    page
      .addPageEmbed((embed) => embed.setDescription(MODERATION_DESCRIPTION))
      .addPageEmbed((embed) => embed.setDescription("Admin page"));

    await page.run(interaction, interaction.user);
  }
}
