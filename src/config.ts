export const bot_config = {
  developerIds: ["1125852865534107678"],
  developerNames: ["notsoray"], // Matches the ID.
  default_language: "en_US",
  dashboard: {
    enabled: false,
    port: 10,
  },
};

export const emojis = {
  folder: {
    id: "1200424376084992181",
    name: ":f_b:",
    raw: "<:f_b:1200424376084992181>",
  },

  utility: {
    disable: {
      id: "1201528533906882720",
      name: ":u_d:",
      raw: "<:u_d:1201528533906882720>",
    },
    active: {
      id: "1201528414675423232",
      name: ":u_d:",
      raw: "<:u_d:1201528414675423232>",
    },
    true: {
      id: "1200466489703157831",
      name: "<:u_t>",
      raw: "<:u_t:1200466489703157831>",
    },
    false: {
      id: "1200466558733004811",
      name: "<:u_f>",
      raw: "<:u_f:1200466558733004811>",
    },
  },

  apps: {
    github: {
      id: "1201458525243711489",
      name: ":a_gh:",
      raw: "<:a_gh:1201458525243711489>",
    },
  },
};

export default {
  emojis,
  bot_config,
};
