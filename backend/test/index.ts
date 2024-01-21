import { WebSocket } from "ws";
const wss = new WebSocket(`https://88zcpz-3000.csb.app/`);

wss.on("open", () => {
  wss.send([{ token: "test", message: "<Client>#ws" }]);

  wss.onmessage = (message) => {
    const data = message.data;
    console.log(data);
  };
});
