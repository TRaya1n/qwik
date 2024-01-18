import { PermissionsString, SlashCommandBuilder, Snowflake } from "discord.js";

export interface SlashCommandProperties {
  data: SlashCommandBuilder;
  execute: (...args: any) => any;
}

export interface CommandProperties {
  name: string;
  aliases?: any[];
  category: string;
  description?: string;
  usage?: string;
  permissions?: {
    user?: PermissionsString[];
    client?: PermissionsString[];
  };
  filters?: {
    developerOnly?: boolean;
    guild?: {
      ids: any[Snowflake];
      reply: boolean;
    };
  };
  execute: (...args: any) => any;
}
