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

    const MOD = {
      header: `# Moderation\n`,
      exta_information: `- *Qwik v2 has new moderation feature's!*\n\n`,
      commands_nickname: `</moderation nickname:1199648228438712321>\n- **Change the specified members nickname.**\n - \`<nickname>\`: **The nickname to give this member. (max 32 characters)**\n\n`,
      commands_kick: `</moderation kick:1199648228438712321>\n- **Kick the specified member from this server.**\n - \`<member>\`: **The member to kick from this guild**\n - \`[reason]\`: **The reason for kicking this member from this guild. (max 35 characters)**\n\n`,
      commands_ban: `</moderation ban:1199648228438712321>\n- **Ban the specified member from this server**\n - \`<member>\`: **The member to ban**\n - \`[reason]\`: **The reason for banning this member**\n\n`,
    };

    const CONFIG = {
      header: "# Config\n",
      extra_information: "- *Qwik v2 has new configure commands!*\n\n",
      commands_logging_message: `</config logging message:1200847772094582804>\n- **Configure the message log channel.**\n - \`<enabled>\`: **Enable/Disable this module.**\n - \`<channel>\`: **The channel to log message updates.**\n\n`,
      commands_logging_channel: `</config logging channel:1200847772094582804>\n- **Configure the channel log channel.**\n - \`<enabled>\`: **Enable/Disable this module.**\n - \`<channel\`: **The channel to log channel updates.**\n\n`,
    };

    const FUN = {
      header: "# Fun\n",
      extra_information: "- *New fun commands!*\n\n",
      commands_8ball: `</fun 8ball:1199602148929978368>\n- **Ask me a yes-or-no question**\n - \`<question>\`: **The question you want the answer to.**\n\n`,
      commands_joke: `</fun joke:1199602148929978368>\n- **Get a random joke!**\n - \`<category>\`: **Select a category.**\n\n`,
      commands_facts: `</fun facts:1199602148929978368>\n- **Get fun facts!**\n - \`<type>\`: **Type of fact you want.**\n\n`,
      commands_anime_quote: `</fun anime quote:1199602148929978368>\n- **Get a random anime quote!**\n - \`<>\`: **No options.**\n\n`,
    };

    page
      .addPageEmbed((embed) =>
        embed.setDescription(
          `${MOD.header}${MOD.exta_information}${MOD.commands_nickname}${MOD.commands_kick}${MOD.commands_ban}`,
        ),
      )
      .addPageEmbed((embed) =>
        embed.setDescription(
          `${CONFIG.header}${CONFIG.extra_information}${CONFIG.commands_logging_message}${CONFIG.commands_logging_channel}`,
        ),
      )
      .addPageEmbed((embed) =>
        embed.setDescription(
          `${FUN.header}${FUN.extra_information}${FUN.commands_8ball}${FUN.commands_joke}${FUN.commands_facts}${FUN.commands_anime_quote}`,
        ),
      );

    try {
      await interaction.deferUpdate();
      return await page.run(interaction, interaction.user);
    } catch (error) {
      this.container.logger.fatal(error);
    }
  }
}
