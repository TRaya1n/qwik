import mongoose, { Schema } from "mongoose";

export const guilds = mongoose.model(
  "guild",
  new Schema({
    id: String,

    log: {
      message_logging: {
        enabled: { type: Boolean, default: false },
        channel: { type: String, default: null },
      },
    },

    automod: {
      anti_invite: {
        enabled: { type: Boolean, default: false },
        action: { type: String, default: "delete" },
      },
    },
  }),
);

export default {
  guilds,
};
