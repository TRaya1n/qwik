import { config } from "dotenv";
import { GatewayIntentBits, Partials } from "discord.js";
import { Qwik } from "./Qwik/index";
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

client.initQwikEvent({ client: client, path: "./src/events/" });
client.initQwikCommand({
  client: client,
  path: "./src/commands/",
  message: { prefix: "qw." },
});
