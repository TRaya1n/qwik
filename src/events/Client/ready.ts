import { Client } from "discord.js";

export function Event(client: Client) {
    console.log(`Ready! ${client.user?.username}`);
}