import { WebSocket } from "ws";
import { Qwik } from "../src/Qwik/index";
import serialize from "serialize-javascript";

export const backend = {
  get: (client: Qwik) => {
    const wss = new WebSocket.Server({ port: 3000 });

    wss.on("connection", (ws) => {
      ws.on("message", (data: any) => {
        const object = data.toString("utf-8");

        console.log(object);

        if (object.message === "<Client>#user_information") {
          if (client.user) {
            ws.send(
              serialize({
                type: 1,
                user: {
                  id: client.user.id,
                  username: client.user.username,
                  discriminator: client.user.discriminator,
                  avatar: client.user.avatar,
                  accentColor: client.user.accentColor,
                  createdAt: client.user.createdAt,
                  flags: client.user.flags?.serialize(),
                  verified: client.user.verified,
                  status: client.user.presence.status,
                },
              }),
            );
          } else {
            ws.send(
              serialize({
                type: 1,
                user: null,
                message: "<Client>#user is not ready(?)",
              }),
            );
          }
        } else if (object.message === "<Client>#ws") {
          ws.send(
            serialize({
              type: 2,
              ws: {
                ping: client.ws.ping,
                status: client.ws.status,
                shards: client.ws.shards,
              },
            }),
          );
        }
      });
    });

    wss.on("connection", (ws) => {
      setInterval(() => {
        ws.ping("ping-pong");
      }, 5000);
    });
  },
};
