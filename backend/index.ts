const express = require("express");
import { Qwik } from "../src/Qwik/index";
import serialize from "serialize-javascript";

export const backend = {
  get: (client: Qwik) => {
    const app = express();

    app.use(express.json());

    app.get("/", (req, res) => {
      res.status(200).send({
        message: "Working, Qwik!",
        ws_ping: client.ws.ping,
      });
    });

    app.get("/api", (req, res) => {
      res.status(200).json({
        p: ["/guilds/:id", "/guilds/:id/:cid"],
        d: { i: "You can't access any data without the required header." },
      });
    });

    app.get("/api/users/:id", checkForHeader, async (req, res) => {
      try {
        const { id } = req.params;
        const user = await client.users.fetch(id);
        res.status(200).json(user.toJSON());
      } catch (error) {
        if (error.rawError.message === "Unknown User") {
          return res.status(401).send({ error: "user not found" });
        }
      }
    });

    app.get("/api/guilds/:id", checkForHeader, async (req, res) => {
      try {
        const { id } = req.params;
        const guild = await client.guilds.fetch(id);
        res.status(200).json(guild.toJSON());
      } catch (error) {
        if (error.rawError.message === "Unknown Guild") {
          return res.status(401).send({ error: "guild not found" });
        }
      }
    });

    app.get("/api/guilds/:id/:cid", checkForHeader, async (req, res) => {
      try {
        const { id, cid } = req.params;
        const guild = await client.guilds.fetch(id);
        const channel = await guild.channels.fetch(cid);
        res.status(200).json(channel?.toJSON());
      } catch (error) {
        if (error.rawError.message === "Unknown Guild") {
          return res.status(401).send({ error: "guild not found" });
        } else if (error.rawError.message === "Unknown Channel") {
          return res.status(401).send({ error: "channel not found!" });
        }
      }
    });

    app.listen(3000, () => {
      console.log("Website Ready!");
    });

    function checkForHeader(req: Request, res: Response, next: any) {
      if (
        req.headers["x-qwik-api-key"] &&
        req.headers["x-qwik-api-key"] === "qwik"
      ) {
        console.log(
          `[${new Date().toISOString()}] ${req.method}:${req.url} / ${req.headers["x-forwarded-for"]}`,
        );
        return next();
      } else {
        return res
          .status(401)
          .json({ message: "Unauthorized, Missing API Key!" });
      }
    }
  },
};
