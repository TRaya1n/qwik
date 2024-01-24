import {
  SapphireClient,
  LogLevel,
  RegisterBehavior,
  ApplicationCommandRegistries,
} from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";
import mongoose from "mongoose";

// Configs
import { sapphire_configs as sappconfig } from "./config";
import { configDotenv } from "dotenv";
configDotenv();

const client = new SapphireClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  logger: {
    level: LogLevel.Debug,
  },
  loadApplicationCommandRegistriesStatusListeners: false,
});

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
  RegisterBehavior.BulkOverwrite,
);

const main = async () => {
  try {
    mongoose.connect(process.env.MONGOOSE_URI!);
    client.logger.info("Connected to the db!");
    await client.login();
  } catch (error) {
    client.logger.error(error);
  }
};

void main();
