import { Schema, model } from "mongoose";

export const clientSchema = model(
  "client",
  new Schema({
    pass: String,
    messageCommandsRanAllTime: Number,
    chatInputCommandsRanAllTime: Number,
    userContextMenuRanAllTime: Number,
  }),
);
