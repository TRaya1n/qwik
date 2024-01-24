import { Subcommand } from "@sapphire/plugin-subcommands";

export class Bot extends Subcommand {
  public constructor(
    context: Subcommand.LoaderContext,
    options: Subcommand.Options,
  ) {
    super(context, {
      ...options,
      name: "admin",
      subcommands: [
        {
          name: "automod",
          type: "group",
          entries: [{ name: "anti_invite", chatInputRun: "anti_invite" }],
        },
      ],
    });
  }

  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand((builder) => {
      return builder
        .setName("admin")
        .setDescription("Admin commands!")
        .addSubcommandGroup((option) => {
          return option
            .setName("automod")
            .setDescription("AutoModeration commands!")
            .addSubcommand((option) => {
              return option
                .setName("anti_invite")
                .setDescription("Configure anti invite link settings!")
                .addBooleanOption((option) => {
                  return option
                    .setName("enable")
                    .setDescription("Enable anti invite link setting?")
                    .setRequired(true);
                });
            });
        });
    });
  }

  public async anti_invite(
    interaction: Subcommand.ChatInputCommandInteraction,
  ) {
    interaction.reply("anti_invitw links");
  }
}
