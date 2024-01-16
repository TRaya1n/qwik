import { config } from "dotenv";
import { GatewayIntentBits, Partials } from "discord.js";
import { Qwik } from "./Qwik/index";
import { logger } from "./Utils/pino-logger";
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
});

process.on("unhandledRejection", async (err) => {
  logger.warn(err);
});

process.on("warning", (warning) => {
  logger.warn(warning, "warning");
});

client.initQwikEvent({ client: client, path: "./src/events/" });
client.initQwikCommand(
  {
    client: client,
    path: "./src/commands/",
    message: { prefix: "qw." },
  },
  true,
  "./src/commands/",
);
(async () => {
  const mongoose = await client.initQwikMongoose();
  mongoose.connection.on("connected", () => {
    logger.info(`MongoDB connection successfull!`);
  });
})();
