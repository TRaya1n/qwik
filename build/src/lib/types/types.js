"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NekoBuildURL = exports.NekoAPITypes = void 0;
var NekoAPITypes;
(function (NekoAPITypes) {
    NekoAPITypes["Threat"] = "threats";
    NekoAPITypes["Distracted"] = "ship";
})(NekoAPITypes || (exports.NekoAPITypes = NekoAPITypes = {}));
/**
 * @link https://docs.nekobot.xyz
 * @returns {URL|string}
 */
function NekoBuildURL(type) {
    return `https://nekobot.xyz/api/imagegen?type=${type}`;
}
exports.NekoBuildURL = NekoBuildURL;
