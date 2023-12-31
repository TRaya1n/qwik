import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  REST,
  Routes,
} from "discord.js";
import { QwikCommandOptions } from "./interfaces/QwikCommandOptions";
import { readdirSync } from "fs";
import { resolve } from "path";
import { Qwik } from ".";

class QwikCommand {
  public constructor(options: QwikCommandOptions) {
    this.init(options.client, options.path);
    this.interactionCreate(options.client);
    this.messageCreate(options, options.client);
  }

  private init(client: Qwik, path: any) {
    const start = Date.now();

    const folders = readdirSync(path);
    for (const folder of folders) {
      const files = readdirSync(`${path}/${folder}`);
      for (const file of files) {
        const f = require(resolve(path, folder, file));
        if (f.SlashCommand) {
          this.SlashCommandHandler(f.SlashCommand, file, client);
        }

        if (f.MessageCommand) {
          this.MessageCommandHandler(f.MessageCommand, file, client);
        }
      }
    }

    console.log(`Loaded command files! (in ${Date.now() - start}ms)`);
    this.DeploySlashCommands(client.commandsArray);
  }

  private SlashCommandHandler(object: any, file: any, client: Qwik) {
    if (object.data && object.execute) {
      client.commands.set(object.data.name, object);
      client.commandsArray.push(object.data.toJSON());
    } else {
      console.error(
        `[COMMAND_ERROR.SLASHCOMMAND]-${file}: Missing data / execute properties.`,
      );
    }
  }

  private MessageCommandHandler(object: any, file: any, client: Qwik) {
    if (object.name && object.execute) {
      client.messageCommands.set(object.name, object);

      if (Array.isArray(object.aliases)) {
        object.aliases.forEach((element: any) => {
          client.aliases.set(element, object);
        });
      }
    } else {
      console.error(
        `[COMMAND_ERROR.MESSAGECOMMAND]-${file}: Missing name / execute properties.`,
      );
    }
  }

  private async DeploySlashCommands(commands: []) {
    const rest = new REST().setToken(`${process.env.DISCORD_TOKEN}`);
    return await rest.put(
      Routes.applicationCommands(`${process.env.CLIENT_ID}`),
      {
        body: commands,
      },
    );
  }

  private interactionCreate(client: Qwik) {
    client.on("interactionCreate", (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      console.log(
        `[INTERACTION_COMMAND] Executing ${interaction.commandName} command...`,
      );

      const command: any = client.commands.get(interaction.commandName);

      if (!command) {
        console.warn(
          `[INTERACTION_COMMAND] ${interaction.commandName} command not found.`,
        );
        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.user?.username.toString(),
            iconURL: interaction.user?.displayAvatarURL(),
          })
          .setDescription(`${interaction.commandName} command not found.`)
          .setColor("Orange")
          .setTimestamp();
        interaction.reply({ embeds: [embed] });
        return;
      }

      try {
        command.execute(client, interaction);
        console.log(
          `[INTERACTION_COMMAND] Executed ${interaction.commandName}.`,
        );
      } catch (error) {
        console.error(`[INTERACTION_COMMAND] Error:`);
        console.error(error);
      }
    });
  }

  private messageCreate(options: QwikCommandOptions, client: Qwik) {
    client.on("messageCreate", (message) => {
      const prefix = options.message?.prefix;
      if (message.author.bot) return;
      if (!message.guild) return;
      if (!message.content.startsWith(`${prefix}`)) return;

      const args = message.content
        .slice(prefix?.length)
        .trim()
        .split(/ +/g);
      const input = args.shift()?.toLowerCase();

      let command = client.messageCommands.get(`${input}`);
      if (!command) command = client.aliases.get(`${input}`);

      if (!command) {
        console.warn(`[MESSAGE_COMMAND] ${message.content} not found.`);
        return;
      }

      try {
        command.execute(client, message, args);
      } catch (error) {
        console.error(`[MESSAGE_COMMAND] Error:`);
        console.error(error);
      }
    });
  }
}

export { QwikCommand };
