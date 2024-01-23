import { Command } from "@sapphire/framework";

export class PingCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options, cooldownDelay: 10000 });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) => {
        return builder.setName("ping").setDescription("Qwiks ping");
      },
      { idHints: ["1199414063231422546"] },
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    return interaction.reply("My ping is: " + this.container.client.ws.ping);
  }
}
