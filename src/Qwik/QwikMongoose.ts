import mongoose, { mongo } from "mongoose";

export class QwikMongoose {
  public constructor(
    uri?: string | undefined,
    Options?: mongoose.MongooseOptions,
  ) {}

  public async init(
    uri?: string | undefined,
    QwikMongooseOptionsArgs?: mongoose.MongooseOptions,
  ) {
    return await mongoose.connect(
      `${uri ? uri : process.env.MONGOOSE_URI}`,
      QwikMongooseOptionsArgs,
    );
  }
}
