import {
  InteractionHandler,
  InteractionHandlerTypes,
} from "@sapphire/framework";
import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";

export class ButtonHandler extends InteractionHandler {
  public constructor(
    context: InteractionHandler.LoaderContext,
    options: InteractionHandler.Options,
  ) {
    super(context, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public async run(interaction: ButtonInteraction) {
    console.log(interaction.customId);
    if (interaction.customId === "about-me")
      return await this.about_me(interaction);
  }

  private async about_me(interaction: ButtonInteraction) {
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
    const CONFIG = {
      header: '# Config\n',
      extra_information: '- *Qwik v2 has new configure commands!*\n\n',
      commands_logging_message: `</config logging message:1200847772094582804>\n- **Configure the message log channel.**\n - \`<enabled>\`: **Enable/Disable this module.**\n - \`<channel>\`: **The channel to log message updates.**\n\n`,
      commands_logging_channel: `<config logging channel:1200847772094582804>\n- **Configure the channel log channel.**\n - \`<enabled>\`: **Enable/Disable this module.**\n - \`<channel\`: **The channel to log channel updates.**\n\n`
    }

    page
      .addPageEmbed((embed) => embed.setDescription(MODERATION_DESCRIPTION))
      .addPageEmbed((embed) => embed.setDescription(`${CONFIG.header}${CONFIG.extra_information}${CONFIG.commands_logging_message}${CONFIG.commands_logging_channel}`));

    try {
      const message = await interaction.message.fetch();
      return await page.run(message, interaction.user);
    } catch (error) {
      this.container.logger.fatal(error);
    }
  }
}
