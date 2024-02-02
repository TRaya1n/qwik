"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guilds = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.guilds = mongoose_1.default.model("guild", new mongoose_1.Schema({
    id: String,
    log: {
        message_logging: {
            enabled: { type: Boolean, default: false },
            channel: { type: String, default: null },
        },
        channel_logging: {
            enabled: { type: Boolean, default: false },
            channel: { type: String, default: null },
        },
    },
    automod: {
        anti_invite: {
            enabled: { type: Boolean, default: false },
            action: { type: String, default: "delete" },
        },
    },
}));
exports.default = {
    guilds: exports.guilds,
};
