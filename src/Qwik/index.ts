import {
  ApplicationCommandData,
  ApplicationCommandResolvable,
  Client,
  ClientOptions,
  Collection,
} from "discord.js";
import { QwikEventOptions } from "./interfaces/QwikEventOptions";
import { QwikEvent } from "./Event";
import { QwikCommandOptions } from "./interfaces/QwikCommandOptions";
import { QwikCommand } from "./Command";

class Qwik extends Client {
  constructor(options: ClientOptions) {
    super(options);
    this.login();
  }

  public commands = new Collection<string, ApplicationCommandResolvable>();
  public messageCommands = new Collection<string, any>();
  public commandsArray: any = [];

  public initQwikEvent(QwikEventOptionsArgs: QwikEventOptions) {
    return new QwikEvent(QwikEventOptionsArgs);
  }

  public initQwikCommand(QwikCommandOptionsArgs: QwikCommandOptions) {
    return new QwikCommand(QwikCommandOptionsArgs);
  }
}

export { Qwik };
