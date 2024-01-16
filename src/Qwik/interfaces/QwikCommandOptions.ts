import { PermissionsString, SlashCommandBuilder, Snowflake } from "discord.js";
import { Qwik } from "..";

export interface QwikCommandOptions {
  client: Qwik;
  path: any;
  message?: {
    prefix: string;
  };
}

export interface SlashCommandProperties {
  data: SlashCommandBuilder;
  execute: (...args: any) => any;
}

// Message command properties
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
