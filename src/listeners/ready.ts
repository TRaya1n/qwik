import { Listener } from "@sapphire/framework";
import { AutoSendJoke } from "../utils/auto/joke";

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

    setInterval(() => {
    AutoSendJoke(this.container.client);
    }, 3600000);
  }
}
