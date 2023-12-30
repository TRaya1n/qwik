import { Client } from "discord.js";

export function Event(client: Client, start: number) {
  console.log(
    `Ready! ${client.user?.username} (in ${Math.floor(
      (Date.now() - start) / 1000,
    )}s)`,
  );
}
