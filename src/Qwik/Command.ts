import { ChatInputCommandInteraction, REST, Routes } from "discord.js";
import { QwikCommandOptions } from "./interfaces/QwikCommandOptions";
import { readdirSync } from "fs";
import { resolve } from "path";
import { Qwik } from ".";

class QwikCommand {
    public constructor(options: QwikCommandOptions) {
        this.init(options.client, options.path);
        this.interactionCreate(options.client)
    }

    private init(client: Qwik, path: any) {
        const folders = readdirSync(path);
        for (const folder of folders) {
            const files = readdirSync(`${path}/${folder}`);
            for (const file of files) {
                const f = require(resolve(path, folder, file));
                if (f.SlashCommand) {
                    this.SlashCommandHandler(f.SlashCommand, file, client);
                }
            }
        }
    }

    private SlashCommandHandler(object: any, file: any,  client: Qwik) {
        if (object.data && object.execute) {
            client.commands.set(object.data.name, object);
            client.commandsArray.push(object.data.toJSON());
            this.DeploySlashCommands(client.commandsArray);
        } else {
            console.error(`[COMMAND_ERROR.SLASHCOMMAND]-${file}: Missing data / execute properties.`)
        }
    }

    private async DeploySlashCommands(commands: []) {
        const rest = new REST().setToken(`${process.env.DISCORD_TOKEN}`);
        return await rest.put(Routes.applicationCommands(`${process.env.CLIENT_ID}`), {
            body: commands
        });
    }

    private interactionCreate(client: Qwik) {
        client.on('interactionCreate', (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            const command: any = client.commands.get(interaction.commandName);

            if (!command) {
                console.log('Command not found')
                return;
            }

            command.execute(client, interaction);
        });
    }
}

export {
    QwikCommand
}