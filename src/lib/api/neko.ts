import djs from "discord.js";
import { BaseNekoURLObject, NekoDistractedObject, NekoAPITypes, NekoBuildURL } from "../types/types";
import axios from "axios";

export class NekoAPI {
  /**
   * @link https://docs.nekobot.xyz/
   */
  public constructor() {}

  /**
   *
   * @param {BaseNekoURLObject} input
   * @returns {string}
   */
  public async getThreat(input: BaseNekoURLObject) {
    try {
      const response = await axios({
        url: `${NekoBuildURL(NekoAPITypes.Threat)}&url=${input.url}`,
      });

      if (!response.data.message) return;

      return response.data.message;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  /**
   *
   * @param {NekoDistractedObject} input
   * @returns {string}
   */
  public async distracted(input: NekoDistractedObject) {
    try {
      const response = await axios({
        url: `${NekoBuildURL(NekoAPITypes.Distracted)}&user1=${input.avatar}&user2=${input.avatar2}`,
      });

      if (!response.data) return 'An error...'

      return response.data.message;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
