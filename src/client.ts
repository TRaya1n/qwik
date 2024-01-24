import {
  SapphireClient,
  LogLevel,
  RegisterBehavior,
  ApplicationCommandRegistries,
} from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";

import { config } from "dotenv";

config();

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
    client.logger.info("Logging in...");
    await client.login();
    client.logger.info("Logged in!");
  } catch (error) {
    client.logger.error(error);
  }
};

void main();
