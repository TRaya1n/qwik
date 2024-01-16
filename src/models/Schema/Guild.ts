import { Schema, model } from "mongoose";

export const GuildSchema = model(
  "guild",
  new Schema({
    guildId: String,

    automod: {
      actions: { type: String, default: "DELETE" },
      anti_invites: Boolean,
    },
  }),
);
