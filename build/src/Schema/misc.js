"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.misc = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.misc = mongoose_1.default.model("misc", new mongoose_1.default.Schema({
    id: String,
    auto_joke: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String }
    },
}));
exports.default = {
    misc: exports.misc,
};
