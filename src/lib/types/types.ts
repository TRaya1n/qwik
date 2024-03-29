import djs from "discord.js";

export interface BaseNekoURLObject {
  url: string;
}

export interface NekoDistractedObject {
  avatar: string;
  avatar2: string;
}

export enum NekoAPITypes {
  Threat = "threats",
  Distracted = "ship",
}

type NekoAPITypeString = "threats" | "ship";

/**
 * @link https://docs.nekobot.xyz
 * @returns {URL|string}
 */
export function NekoBuildURL(type: NekoAPITypeString | NekoAPITypes) {
  return `https://nekobot.xyz/api/imagegen?type=${type}`;
}

type CommandsModerationBaseCheckIfForString =
  | "manageable"
  | "kickable"
  | "bannable";

export interface CommandsModerationBaseObject {
  requiredPermissionsToRun: djs.PermissionsString;
  member: djs.GuildMember | undefined;
  checkIfFor: CommandsModerationBaseCheckIfForString;
}
