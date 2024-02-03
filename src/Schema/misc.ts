import mongoose from "mongoose";

export const misc = mongoose.model(
  "misc",
  new mongoose.Schema({
    id: String,

    auto_joke: {
      enabled: { type: Boolean, default: false },
      channelId: { type: String }
    },
  }),
);

export default {
  misc,
};
