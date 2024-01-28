import { Command } from "@sapphire/framework";
import { GuildMember, PermissionResolvable } from "discord.js";
import { emojis } from "../config";

/**
 *
 * @param {boolean} tof
 * @returns {emojis.true.raw|emojis.false.raw}
 */
export function tof(tof: boolean) {
  if (tof) {
    return emojis.true.raw;
  } else {
    return emojis.false.raw;
  }
}

/**
 *
 * @param {Command.ChatInputCommandInteraction<"cached">|Command.ContextMenuCommandInteraction<"cached">} interaction
 * @param {PermissionResolvable} permissions
 * @returns {boolean}
 */
export function checkInteractionUserPermissions(
  interaction:
    | Command.ChatInputCommandInteraction<"cached">
    | Command.ContextMenuCommandInteraction<"cached">,
  permissions: PermissionResolvable,
) {
  if (interaction.member.permissions.has(permissions)) {
    return true;
  }

  return false;
}

/**
 *
 * @param {GuildMember|undefined} member
 * @param {PermissionResolvable} permissions
 * @returns {boolean}
 */
export function checkMemberPermissions(
  member: GuildMember | undefined,
  permissions: PermissionResolvable,
) {
  if (member?.permissions.has(permissions)) {
    return true;
  }

  return false;
}

/**
 *
 * @param {GuildMember|undefined} member
 * @param {GuildMember|undefined} member2
 * @returns {boolean}
 */
export function compareRolePositions(
  member: GuildMember | undefined,
  member2: GuildMember | undefined,
) {
  if (
    member &&
    member2 &&
    member?.roles.highest.comparePositionTo(member2?.roles.highest) >= 1
  ) {
    return true;
  }

  return false;
}

/**
 *
 * @param {string} content
 * @param {number} stop
 * @returns {string}
 */
export function checkCharLimit(content: string, stop: number) {
  if (content.length >= stop) {
    return content.substring(0, stop - 3) + "...";
  }

  return content;
}

export default {
  limit: {
    charLimitEmbedDescription: (content: string) =>
      checkCharLimit(content, 2048),
  },
  checkCharLimit,
  comparePositions: compareRolePositions,
  memberPermissions: checkMemberPermissions,
  interactionUserPermissions: checkInteractionUserPermissions,
  emoji: tof,
};