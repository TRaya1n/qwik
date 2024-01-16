import {
  CommandInteractionOptionResolver,
  Embed,
  EmbedBuilder,
  REST,
  Routes,
} from "discord.js";
import {
  CommandProperties,
  QwikCommandOptions,
} from "./interfaces/QwikCommandOptions";
import { readdirSync } from "fs";
import { resolve } from "path";
import { Qwik } from ".";
import { logger } from "../Utils/pino-logger";
import { models } from "../models";

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

        if (f.ContextMenu) {
          this.ContextMenuHandler(f.ContextMenu, file, client);
        }

        if (f.MessageCommand) {
          this.MessageCommandHandler(f.MessageCommand, file, client);
        }
      }
    }

    logger.info(`Loaded command files! (in ${Date.now() - start}ms)`);
    this.DeploySlashCommands(client.commandsArray);
  }

  private ContextMenuHandler(object: any, file: any, client: Qwik) {
    if (object.data && object.execute) {
      client.contextMenuCommands.set(object.data.name, object);
      client.commandsArray.push(object.data.toJSON());
    } else {
      logger.warn(`${file}: Missing data / execute properties.`);
    }
  }

  private SlashCommandHandler(object: any, file: any, client: Qwik) {
    if (object.data && object.execute) {
      client.commands.set(object.data.name, object);
      client.commandsArray.push(object.data.toJSON());
    } else {
      logger.warn(`${file}: Missing data / execute properties.`);
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
      logger.warn(`${file}: Missing name / execute properties.`);
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
      if (interaction.isChatInputCommand()) {
        const command: any = client.commands.get(interaction.commandName);

        if (!command) {
          logger.warn(
            `[INTERACTION_COMMAND] /${interaction.commandName} command not found.`,
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
          command.execute(client, interaction).then(async () => {
            await models.client.findOneAndUpdate(
              { pass: client.user?.id },
              { $inc: { chatInputCommandsRanAllTime: 1 } },
            );
          });
        } catch (error) {
          logger.error(error, `QwikCommandError_InteractionCreate`);
        }
      } else if (interaction.isContextMenuCommand()) {
        logger.debug(interaction);
        const command: any = client.contextMenuCommands.get(
          interaction.commandName,
        );

        logger.debug(command);

        if (!command) {
          return console.log(`${interaction.commandName}: Unknown command.`);
        }

        try {
          command.execute(client, interaction).then(async () => {
            await models.client.findOneAndUpdate(
              { pass: client.user?.id },
              { $inc: { userContextMenuRanAllTime: 1 } },
            );
          });
        } catch (error) {
          logger.error(error, "ContextMenuError");
        }
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

      let command: CommandProperties = client.messageCommands.get(`${input}`);
      if (!command) command = client.aliases.get(`${input}`);

      if (!command) {
        logger.warn(`[MESSAGE_COMMAND] ${message.content} not found.`);
        return;
      }

      if (command.filters) {
        if (
          command.filters.guild &&
          command.filters.guild.ids instanceof Array
        ) {
          if (!command.filters.guild.ids.includes(message.guildId)) {
            if (command.filters.guild.reply) {
              const embed = new EmbedBuilder()
                .setDescription(`**You can't use this command in this guild**`)
                .setColor("Greyple")
                .setTimestamp();
              message.reply({ embeds: [embed] });
              return;
            }
          }
        } else if (
          command.filters.developerOnly &&
          command.filters.developerOnly === true
        ) {
          const developers = ["1125852865534107678"];
          if (!developers.includes(message.author.id)) {
            return;
          }
        }
      }

      if (command.permissions) {
        if (command.permissions.user) {
          if (!message.member?.permissions.has(command.permissions.user)) {
            const embed = new EmbedBuilder()
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL(),
              })
              .setDescription(
                `**You don't have the required permission(s) to execute this command!**\n\n${command.permissions.user.join(
                  ", ",
                )}`,
              )
              .setColor("Orange")
              .setTimestamp();
            message.reply({ embeds: [embed] });
            return;
          }
        }

        if (command.permissions.client) {
          if (!message.member?.permissions.has(command.permissions.client)) {
            const embed = new EmbedBuilder()
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL(),
              })
              .setDescription(
                `**I don't have the required permission(s) to execute this command!**\n\n${command.permissions.client.join(
                  ", ",
                )}`,
              )
              .setColor("Orange")
              .setTimestamp();
            message.reply({ embeds: [embed] });
            return;
          }
        }
      }

      try {
        command.execute(client, message, args).then(async () => {
          await models.client.findOneAndUpdate(
            { pass: client.user?.id },
            { $inc: { messageCommandsRanAllTime: 1 } },
            { upsert: true },
          );
        });
      } catch (error) {
        logger.error(error, `QwikCommandError_MessageCommand`);
      }
    });
  }
}

export { QwikCommand };
