import {
  ApplicationCommandResolvable,
  Client,
  ClientOptions,
  Collection,
} from "discord.js";
import { QwikEvent } from "./Event";
import { CommandProperties } from "./interfaces/QwikCommandOptions";
import { QwikCommand } from "./Command";
import moment from "moment";
import { QwikButton } from "./QwikButton";

class Qwik extends Client {
  constructor(options: ClientOptions) {
    super(options);
    this.login();
    new QwikEvent({
      client: this,
      path: "./src/events/",
    });
    new QwikCommand({
      client: this,
      path: "./src/commands/",
      message: { prefix: "qw." },
    });
    new QwikButton({
      client: this,
      path: "./src/commands/",
    });
  }

  public commands = new Collection<string, ApplicationCommandResolvable>();
  public contextMenuCommands = new Collection<
    string,
    ApplicationCommandResolvable
  >();
  public messageCommands = new Collection<string, CommandProperties>();
  public aliases = new Collection<string, CommandProperties>();
  public commandsArray: any = [];

  /**
   *
   * @returns Date
   */
  public uptimeQwik() {
    return moment.duration(this.uptime).humanize();
  }
}

export { Qwik };
