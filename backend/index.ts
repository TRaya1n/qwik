import { Logger, SapphireClient } from "@sapphire/framework";

import express, { Response, Request } from "express";

const config = {
  api: { enabled: false, port: 3000 }
}

export const backend = {
  get: (client: SapphireClient, logger: Logger) => {
    const app = express();

    app.use(express.json());

    app.get("/", (req: Request, res: Response) => {
      res.status(200).send({
        message: "Working, Qwik!",
        ws_ping: client.ws.ping,
      });
    });

    app.get("/api", (req: Request, res: Response) => {
      res.status(200).json({
        p: ["/guilds/:id", "/guilds/:id/:cid"],
        d: { i: "You can't access any data without the required header." },
      });
    });

    // Public endpoint -> Removed for v2 will be added later.
    /*
    app.get("/api/commands/:name", (req, res) => {
      const { name } = req.params;
      if (name !== "all_commands.slash") {
        const command = client.commands.get(name);
        if (!command) {
          return res.status(401).send({ error: "command not found" });
        }

        return res.status(200).json(command);
      } else {
        return res.status(200).json(client.commands.toJSON());
      }
    });*/

    app.get("/api/users/:id", checkForHeader, async (req: Request, res: Response) => {
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

    app.get("/api/guilds/:id", checkForHeader, async (req: Request, res: Response) => {
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

    app.get("/api/guilds/:id/:cid", checkForHeader, async (req: Request, res: Response) => {
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

    app.listen(config.api.port, () => {
      logger.info("API is running on port " + config.api.port);
    });

    function checkForHeader(req: Request, res: Response, next: any) {
      if (
        req.headers["x-qwik-api-key"] &&
        req.headers["x-qwik-api-key"] === "qwik"
      ) {
        logger.warn(
          `${req.method}:${req.url} / ${req.headers["x-forwarded-for"]}`,
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