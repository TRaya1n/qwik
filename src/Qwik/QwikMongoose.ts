import mongoose from "mongoose";

export class QwikMongoose {
  public constructor(
    uri?: string | undefined,
    Options?: mongoose.MongooseOptions,
  ) {
    this.init(uri, Options);
  }

  private init(
    uri?: string | undefined,
    QwikMongooseOptionsArgs?: mongoose.MongooseOptions,
  ) {
    return mongoose.connect(
      `${uri ? uri : process.env.MONGOOSE_URI}`,
      QwikMongooseOptionsArgs,
    );
  }
}
