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
import moment from "moment";
import { QwikLogger } from "./Logger";
import { QwikButtonOptions } from "./interfaces/QwikButtonOptions";
import { QwikButton } from "./QwikButton";
import mongoose from "mongoose";
import { QwikMongoose } from "./QwikMongoose";

class Qwik extends Client {
  constructor(options: ClientOptions) {
    super(options);
    this.login();
  }

  public commands = new Collection<string, ApplicationCommandResolvable>();
  public messageCommands = new Collection<string, any>();
  public aliases = new Collection<string, any>();
  public commandsArray: any = [];

  public initQwikEvent(QwikEventOptionsArgs: QwikEventOptions) {
    return new QwikEvent(QwikEventOptionsArgs);
  }

  public initQwikCommand(
    QwikCommandOptionsArgs: QwikCommandOptions,
    button: boolean,
    path: string,
  ) {
    const cmdhandler = new QwikCommand(QwikCommandOptionsArgs);
    if (button) {
      const btnhandler = new QwikButton({ client: this, path });
      return { cmdhandler, btnhandler };
    }
    return { cmdhandler };
  }

  public initQwikMongoose(uri?: string | undefined, Options?: mongoose.MongooseOptions) {
    return new QwikMongoose(uri, Options);
  }

  public initQwikLogger() {
    return new QwikLogger();
  }

  /**
   *
   * @returns Date
   */
  public uptimeQwik() {
    return moment.duration(this.uptime).humanize();
  }
}

export { Qwik };
