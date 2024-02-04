import { Subcommand } from "@sapphire/plugin-subcommands";
import {
  EightBall,
  getJoke,
  JokeAPICategories,
  getAnimeQuote,
  getFact,
  FactTypes,
  AnimeImageSearch,
  AnimeWaifu,
} from "../lib/index";
import { EmbedBuilder } from "discord.js";

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
          entries: [
            { name: "quote", chatInputRun: "animeQuote" },
            { name: "fact", chatInputRun: "animeFact" },
            { name: "search", chatInputRun: "animeImageSearch" },
          ],
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
              JokeAPICategories.forEach((value) =>
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
              FactTypes.forEach((value) =>
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
            })
            .addSubcommand((command) => {
              return command
                .setName("search")
                .setDescription("Search for an anime using a image.")
                .addAttachmentOption((option) => {
                  return option
                    .setName("image")
                    .setDescription("The image you want to search with.")
                    .setRequired(true);
                });
            })
            .addSubcommand((command) => {
              return command
                .setName("fact")
                .setDescription("Get a fact about anime.");
            });
        });
    });
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
      interaction,
      {
        blacklist: ["nsfw", "racist", "sexist"],
        category: category ? category : "Any",
      },
      {
        author: {
          name: interaction.user.username,
          icon_url: interaction.user.displayAvatarURL(),
        },
        timestamp: true,
        footer: { text: "Powered by: https://v2.jokeapi.dev | @lib/v2" },
      },
    );
  }

  public async facts(interaction: Subcommand.ChatInputCommandInteraction) {
    await getFact(interaction, {
      type: interaction.options.getString("type") || "useless",
      author: {
        name: interaction.user.username,
        icon_url: interaction.user.displayAvatarURL(),
      },
      timestamp: true,
      footer: { text: `Powered by: https://shorturl.at/bjvSW | @lib/v2` },
    });
  }

  public async animeImageSearch(
    interaction: Subcommand.ChatInputCommandInteraction,
  ) {
    const attachment = interaction.options.getAttachment("image", true);
    await interaction.deferReply();
    await AnimeImageSearch(interaction, {
      url: attachment.url,
      author: {
        name: interaction.user.username,
        icon_url: interaction.user.displayAvatarURL(),
      },
    });
  }

  public async animeFact(interaction: Subcommand.ChatInputCommandInteraction) {
    await interaction.deferReply();
    const anime = new AnimeWaifu();
    const embed = await anime.getFact(interaction);
    if (!embed) return;
    interaction.editReply({
      embeds: [
        embed
          .setColor("Blurple")
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          }),
      ],
    });
  }

  public async animeQuote(interaction: Subcommand.ChatInputCommandInteraction) {
    await getAnimeQuote(interaction, {
      author: {
        name: interaction.user.username,
        icon_url: interaction.user.displayAvatarURL(),
      },
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
