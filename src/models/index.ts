import { GuildSchema } from "./Schema/Guild";
import { clientSchema } from "./Schema/client";

export const models = {
  client: clientSchema,
  Guild: GuildSchema,
};
