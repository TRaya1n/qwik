"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NekoAPI = void 0;
const types_1 = require("../types/types");
const axios_1 = __importDefault(require("axios"));
class NekoAPI {
    /**
     * @link https://docs.nekobot.xyz/
     */
    constructor() { }
    /**
     *
     * @param {BaseNekoURLObject} input
     * @returns {string}
     */
    async getThreat(input) {
        try {
            const response = await (0, axios_1.default)({
                url: `${(0, types_1.NekoBuildURL)(types_1.NekoAPITypes.Threat)}&url=${input.url}`,
            });
            if (!response.data.message)
                return;
            return response.data.message;
        }
        catch (error) {
            console.error(error);
            return error;
        }
    }
    /**
     *
     * @param {NekoDistractedObject} input
     * @returns {string}
     */
    async kidnap(input) {
        try {
            const response = await (0, axios_1.default)({
                url: `https://nekobot.xyz/api/imagegen?type=${types_1.NekoAPITypes.Distracted}&user1=${input.avatar}&user2=${input.avatar2}`,
            });
            if (!response.data)
                return 'An error...';
            return response.data.message;
        }
        catch (error) {
            console.error(error);
            return error;
        }
    }
}
exports.NekoAPI = NekoAPI;
