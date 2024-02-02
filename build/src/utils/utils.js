"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForInviteLink = exports.checkCharLimit = exports.compareRolePositions = exports.checkMemberPermissions = exports.checkInteractionUserPermissions = exports.eod = exports.tof = void 0;
const config_1 = require("../config");
/**
 *
 * @param {boolean} tof
 * @description true = checkMarkEmoji; false = WopWopWopYouSuck
 * @returns {emojis.true.raw|emojis.false.raw}
 */
function tof(tof) {
    if (tof) {
        return config_1.emojis.utility.true.raw;
    }
    else {
        return config_1.emojis.utility.false.raw;
    }
}
exports.tof = tof;
/**
 * @param {boolean} tof
 * @description true = active; false = disable
 * @returns {emojis.utility.active.raw|emojis.utility.disable.raw}
 */
function eod(tof) {
    if (tof) {
        return config_1.emojis.utility.active.raw;
    }
    else {
        return config_1.emojis.utility.disable.raw;
    }
}
exports.eod = eod;
/**
 *
 * @param {Command.ChatInputCommandInteraction<"cached">|Command.ContextMenuCommandInteraction<"cached">} interaction
 * @param {PermissionResolvable} permissions
 * @returns {boolean}
 */
function checkInteractionUserPermissions(interaction, permissions) {
    if (interaction.member.permissions.has(permissions)) {
        return true;
    }
    return false;
}
exports.checkInteractionUserPermissions = checkInteractionUserPermissions;
/**
 *
 * @param {GuildMember|undefined} member
 * @param {PermissionResolvable} permissions
 * @returns {boolean}
 */
function checkMemberPermissions(member, permissions) {
    if (member?.permissions.has(permissions)) {
        return true;
    }
    return false;
}
exports.checkMemberPermissions = checkMemberPermissions;
/**
 *
 * @param {GuildMember|undefined} member
 * @param {GuildMember|undefined} member2
 * @returns {boolean}
 */
function compareRolePositions(member, member2) {
    if (member &&
        member2 &&
        member.roles.highest.comparePositionTo(member2.roles.highest) >= 1) {
        return true;
    }
    return false;
}
exports.compareRolePositions = compareRolePositions;
/**
 *
 * @param {string} content
 * @param {number} stop
 * @returns {string}
 */
function checkCharLimit(content, stop) {
    if (content.length >= stop) {
        return content.substring(0, stop - 3) + "...";
    }
    return content;
}
exports.checkCharLimit = checkCharLimit;
function checkForInviteLink(content) {
    if (/(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?p?p?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/.test(content)) {
        return true;
    }
    return false;
}
exports.checkForInviteLink = checkForInviteLink;
exports.default = {
    checkCharLimit,
    comparePositions: compareRolePositions,
    memberPermissions: checkMemberPermissions,
    interactionUserPermissions: checkInteractionUserPermissions,
    emoji: tof,
    eod: eod,
    inviteLink: checkForInviteLink,
};
