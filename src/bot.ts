import {
  SapphireClient,
  LogLevel,
  RegisterBehavior,
  ApplicationCommandRegistries,
} from "@sapphire/framework";
import { GatewayIntentBits, Options } from "discord.js";
import mongoose from "mongoose";

// Configs
import { configDotenv } from "dotenv";
configDotenv();

const client = new SapphireClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  logger: {
    level: LogLevel.Debug,
  },
  loadApplicationCommandRegistriesStatusListeners: false,
  makeCache: Options.cacheWithLimits({
    GuildMemberManager: {
      maxSize: 0,
      keepOverLimit: (value) => value.id === process.env.CLIENT_ID,
    },
    GuildMessageManager: {
      maxSize: 0,
    },
    UserManager: {
      maxSize: 1000,
    },
  }),
});

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
  RegisterBehavior.BulkOverwrite,
);

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URI!);
    client.logger.info("Connected to the db!");
    await client.login();
  } catch (error) {
    client.logger.error(error);
  }
};

void main();
