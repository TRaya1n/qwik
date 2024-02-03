import { Subcommand } from "@sapphire/plugin-subcommands";
import {
  EightBall,
  getJoke,
  getAnimeQuote,
  getFact,
  APICategories,
  getFactAPITypes,
} from "../lib/index";
import { ChannelType, EmbedBuilder } from "discord.js";
import db from "../Schema/misc";
import utils from "../utils/utils";

export class FunCommands extends Subcommand {
  public constructor(
    context: Subcommand.LoaderContext,
    options: Subcommand.Options,
  ) {
    super(context, {
      ...options,
      subcommands: [
        { name: "8ball", chatInputRun: "eightball" },
        { name: "joke", chatInputRun: "joke" },
        { name: "facts", chatInputRun: "facts" },

        {
          name: "anime",
          type: "group",
          entries: [{ name: "quote", chatInputRun: "quote" }],
        },
        {
          name: "config",
          type: "group",
          entries: [{ name: "auto_joke", chatInputRun: "_auto_joke" }],
        },
      ],
    });
  }

  public override async registerApplicationCommands(
    registry: Subcommand.Registry,
  ) {
    registry.registerChatInputCommand((builder) => {
      return builder
        .setName("fun")
        .setDescription("Some fun commands!")
        .addSubcommand((command) => {
          return command
            .setName("8ball")
            .setDescription("Ask a question, i will awnser")
            .addStringOption((option) => {
              return option
                .setName("question")
                .setDescription("The question you want to ask.")
                .setRequired(true)
                .setMinLength(5);
            })
            .addBooleanOption((command) => {
              return command
                .setName("hide")
                .setDescription("Hide the response?");
            });
        })
        .addSubcommand((command) => {
          return command
            .setName("joke")
            .setDescription("Get a random joke!")
            .addStringOption((option) => {
              option.setName("category").setDescription("Select a category");
              APICategories.forEach((value) =>
                option.addChoices({ name: `${value}`, value: `${value}` }),
              );
              return option;
            });
        })
        .addSubcommand((command) => {
          return command
            .setName("facts")
            .setDescription("Get a random fact!")
            .addStringOption((option) => {
              option.setName("type").setDescription("Select a type of fact!");
              getFactAPITypes.forEach((value) =>
                option.addChoices({ name: value, value }),
              );
              return option;
            });
        })
        .addSubcommandGroup((group) => {
          return group
            .setName("anime")
            .setDescription("Anime fun commands!")
            .addSubcommand((command) => {
              return command
                .setName("quote")
                .setDescription("Get a anime quote.");
            });
        })
        .addSubcommandGroup((group) => {
          return group
            .setName("config")
            .setDescription("Config fun commands.")
            .addSubcommand((command) => {
              return command
                .setName("auto_joke")
                .setDescription("Auto send a joke to a channel!")
                .addBooleanOption((option) => {
                  return option
                    .setName("enabled")
                    .setDescription("Do you want to enable or disable?")
                    .setRequired(true);
                })
                .addChannelOption((option) => {
                  return option
                    .setName("channel")
                    .setDescription("The channel to send the joke to.")
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true);
                });
            });
        });
    });
  }

  public async _auto_joke(interaction: Subcommand.ChatInputCommandInteraction) {
    const { options, guild } = interaction;
    await interaction.deferReply();
    const channel = options.getChannel("channel", true);
    const status = options.getBoolean("enabled", true);
    const data: any = await db.misc.findOne({ id: guild?.id });
    if (data) {
      if (status) {
        data.auto_joke.enabled = status;
        data.auto_joke.channelId = channel.id;
        await data.save();
        return interaction.editReply({
          embeds: [
            this.baseEmbed(interaction)
              .setDescription(
                `${utils.emoji(true)} | **Enabled auto joke in ${channel}, i will send a joke in the channel every 1 hour.**`,
              )
              .setColor("Blurple"),
          ],
        });
      } else {
        data.auto_joke.enabled = status;
        data.auto_joke.channelId = null;
        await data.save();
        return interaction.editReply({
          embeds: [
            this.baseEmbed(interaction)
              .setDescription(`${utils.emoji(true)} | **Disabled auto joke.**`)
              .setColor("Blurple"),
          ],
        });
      }
    } else {
      await new db.misc({ id: guild?.id }).save();
      return interaction.editReply({
        embeds: [
          this.baseEmbed(interaction)
            .setDescription(
              `${utils.emoji(false)} | **Looks like this server does not exist on my database... please run this command again.**`,
            )
            .setColor("Blurple"),
        ],
      });
    }
  }

  public eightball(interaction: Subcommand.ChatInputCommandInteraction) {
    const question = interaction.options.getString("question", true);
    const ephemeral = interaction.options.getBoolean("hide") || false;
    EightBall(question, {
      embed: true,
      embed_options: {
        color: "Blurple",
        timestamp: true,
      },
      target: interaction.user,
      message: interaction,
      message_options: {
        ephemeral,
      },
    });
  }

  public async joke(interaction: Subcommand.ChatInputCommandInteraction) {
    const category = interaction.options.getString("category");
    await getJoke(
      { category },
      {
        embed_options: { color: "Blurple", timestamp: true },
        data: { target: interaction.user, message: interaction },
      },
    );
  }

  public async facts(interaction: Subcommand.ChatInputCommandInteraction) {
    await getFact({
      type: interaction.options.getString(`type`) || "useless",
      embed: true,
      message: interaction,
      data: {
        target: interaction.user,
        color: "Blurple",
        footer: true,
        timestamp: true,
      },
    });
  }

  public async quote(interaction: Subcommand.ChatInputCommandInteraction) {
    await getAnimeQuote({
      embed: true,
      message: interaction,
      target: interaction.user,
      color: "Blurple",
      timestamp: true,
    });
  }

  public baseEmbed(interaction: Subcommand.ChatInputCommandInteraction) {
    return new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();
  }
}
