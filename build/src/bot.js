"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const mongoose_1 = __importDefault(require("mongoose"));
// Configs
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const client = new framework_1.SapphireClient({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
    partials: [discord_js_1.Partials.Channel],
    logger: {
        level: framework_1.LogLevel.Debug,
    },
    loadApplicationCommandRegistriesStatusListeners: false,
});
framework_1.ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(framework_1.RegisterBehavior.BulkOverwrite);
const main = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGOOSE_URI);
        client.logger.info("Connected to the db!");
        await client.login();
    }
    catch (error) {
        client.logger.error(error);
    }
};
void main();
