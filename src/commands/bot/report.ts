import { Command } from "@sapphire/framework";
import {
  ActionRowBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  WebhookClient,
} from "discord.js";
import utils from "../../utils/utils";

export class ReportCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) => {
      return builder
        .setName("report")
        .setDescription("Report an issue related to the bot.");
    });
  }

  public override chatInputRun(
    interaction: Command.ChatInputCommandInteraction,
  ) {
    const modal = new ModalBuilder()
      .setCustomId(`report`)
      .setTitle("Report an issue.");

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setRequired(true)
        .setCustomId("report-issue_description")
        .setLabel("Issue Description")
        .setPlaceholder("The bot is responding very slow.")
        .setStyle(TextInputStyle.Paragraph),
    );

    const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setRequired(false)
        .setCustomId("report-message_id")
        .setLabel("Bot Message link/ID")
        .setPlaceholder("An message link or an ID.")
        .setStyle(TextInputStyle.Short),
    );

    modal.setComponents(row, row2);

    interaction.showModal(modal);

    interaction
      .awaitModalSubmit({
        filter: (i) => i.customId === "report",
        time: 60_000,
      })
      .then((i) => {
        if (!i.isModalSubmit()) return;
        let method = null;
        if (process.env.REPORT_LOGS_WEBHOOK)
          method = new WebhookClient({ url: process.env.REPORT_LOGS_WEBHOOK });
        const embed = this.baseEmbed(interaction);
        if (method instanceof WebhookClient) {
          method.send({
            embeds: [
              embed
                .setTitle(
                  `Report in ${interaction.guild?.name} by ${interaction.user.username}`,
                )
                .setDescription(
                  `- **Description:**\n - ${i.fields.getTextInputValue("report-issue_description")}\n- **Message Link/ID:**\n - ${i.fields.getTextInputValue("report-message_id")}`,
                )
                .setColor("Blurple"),
            ],
          });
          return i.reply({
            content: `${utils.emoji(true)} | **Report sent, thank you for reporting!**`,
            ephemeral: true,
          });
        }
      })
      .catch((reason) => {
        if (reason === "time") {
          interaction.reply({
            content: `${utils.emoji(false)} | **You didn’t submit the modal in time**`,
            ephemeral: true,
          });
        }
      });
  }

  private baseEmbed(interaction: Command.ChatInputCommandInteraction) {
    return new EmbedBuilder()
      .setAuthor({
        name: interaction.user.id,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();
  }
}
