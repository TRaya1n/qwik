import { Subcommand } from "@sapphire/plugin-subcommands";
import {
  EightBall,
  getJoke,
  getAnimeQuote,
  getFact,
  APICategories,
  getFactAPITypes,
} from "../lib/index";

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
}
