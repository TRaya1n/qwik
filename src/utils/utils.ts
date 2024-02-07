import { Command } from "@sapphire/framework";
import { GuildMember, PermissionResolvable } from "discord.js";
import { emojis } from "../config";

/**
 *
 * @param {boolean} tof
 * @description true = checkMarkEmoji; false = WopWopWopYouSuck
 * @returns {emojis.true.raw|emojis.false.raw}
 */
export function tof(tof: boolean) {
  if (tof) {
    return emojis.utility.true.raw;
  } else {
    return emojis.utility.false.raw;
  }
}

/**
 * @param {boolean} tof
 * @description true = active; false = disable
 * @returns {emojis.utility.active.raw|emojis.utility.disable.raw}
 */
export function eod(tof: boolean) {
  if (tof) {
    return emojis.utility.active.raw;
  } else {
    return emojis.utility.disable.raw;
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
    member.roles.highest.comparePositionTo(member2.roles.highest) >= 1
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

export function checkForInviteLink(content: string) {
  if (
    /(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?p?p?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/.test(
      content,
    )
  ) {
    return true;
  }
  return false;
}

export function randomString(len: number) {
  let charset =
    "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM!@#$%^&*()";
  let result = "";
  for (let i = 0; i < len; i++) {
    let charsetlength = charset.length;
    result += charset.charAt(Math.floor(Math.random() * charsetlength));
  }
  return result;
}

export default {
  randomString,
  checkCharLimit,
  comparePositions: compareRolePositions,
  memberPermissions: checkMemberPermissions,
  interactionUserPermissions: checkInteractionUserPermissions,
  emoji: tof,
  eod: eod,
  inviteLink: checkForInviteLink,
};
