import { Schema, model } from "mongoose";

export const clientSchema = model(
  "client",
  new Schema({
    pass: String,
    api_key: String,

    messageCommandsRanAllTime: Number,
    chatInputCommandsRanAllTime: Number,
    userContextMenuRanAllTime: Number,
  }),
);
