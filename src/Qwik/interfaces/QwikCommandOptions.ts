import { PermissionsString, Snowflake } from "discord.js";
import { Qwik } from "..";

export interface QwikCommandOptions {
  client: Qwik;
  path: any;
  message?: {
    prefix: string;
  };
}

// Message command properties
export interface CommandProperties {
  name: string;
  aliases?: [];
  category: string;
  description?: string;
  usage?: string;
  permissions?: {
    user?: [PermissionsString];
    client?: [PermissionsString];
  };
  filters?: {
    developerOnly?: boolean;
    guild: {
      ids: any[Snowflake];
      reply: boolean;
    };
  };
  execute: (...args: any) => any;
}
