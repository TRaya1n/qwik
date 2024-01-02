import { ActivityType } from "discord.js";
import { Qwik } from "../../Qwik";

export async function Event(client: Qwik, start: number) {
  console.log(
    `Ready! ${client.user?.username} (in ${Math.floor(
      (Date.now() - start) / 1000,
    )}s)`,
  );

  await client.user?.setActivity({
    name: `qw.`,
    type: ActivityType.Listening,
  });
}
