import { Listener } from "@sapphire/framework";
import { misc } from "../Schema/misc";
import { AutoJoke } from "../utils/works/AutoJoke";

export class ReadyListener extends Listener {
  public constructor(
    context: Listener.LoaderContext,
    options: Listener.Options,
  ) {
    super(context, {
      ...options,
      once: true,
      event: "ready",
    });
  }

  public override async run() {
    this.container.logger.info(
      `${this.container.client.user?.username}, is ready!`,
    );

    setInterval(async () => {
      const guilds = await misc.find();
      for (const guild of guilds) {
        AutoJoke(guild.id!, this.container.client);
      }
    }, 1200000); // 20 minutes
  }
}
