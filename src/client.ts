import { config } from "dotenv";
import { GatewayIntentBits, Partials } from "discord.js";
import { Qwik } from "./Qwik/index";
import mongoose from "mongoose";
import { logger } from "./Utils/pino-logger";
import { sendErrorMessage } from "./Utils/helpers";
config();

const client = new Qwik({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.GuildMember, Partials.Channel],
  allowedMentions: { repliedUser: false },
});

process.on("uncaughtException", (error) => {
  logger.error(error);
  sendErrorMessage({ client, error });
});

process.on("unhandledRejection", async (error) => {
  logger.warn(error);
  sendErrorMessage({ client, error });
});

process.on("warning", (warning) => {
  logger.warn(warning, "warning");
});

(async () => {
  mongoose.connect(`${process.env.MONGOOSE_URI}`);
  logger.info(`MongoDB connection successful!`);
})();
