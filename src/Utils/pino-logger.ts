import pino from "pino";
export const logger = pino({
  level: "info",
  customLevels: {
    message: 35,
  },
  timestamp() {
    return pino.stdTimeFunctions.isoTime();
  },
  formatters: {
    bindings: (binding) => {
      return {
        node_version: process.version,
      };
    },
  },
});
