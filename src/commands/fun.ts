import { Subcommand } from "@sapphire/plugin-subcommands";
import { EightBall } from "../lib/index";

export class FunCommands extends Subcommand {
  public constructor(
    context: Subcommand.LoaderContext,
    options: Subcommand.Options,
  ) {
    super(context, {
      ...options,
      subcommands: [{ name: "8ball", chatInputRun: "eightball" }],
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
        });
    });
  }

  public eightball(interaction: Subcommand.ChatInputCommandInteraction) {
    const question = interaction.options.getString("question", true);
    const ephemeral = interaction.options.getBoolean('hide') || false;
    const response = EightBall(question, {
      embed: true,
      embed_options: {
        color: "Blurple",
        timestamp: true,
      },
      target: interaction.user,
      message: interaction,
      message_options: {
        ephemeral
      }
    });
  }
}
