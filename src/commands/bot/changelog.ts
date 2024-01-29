import { Command } from "@sapphire/framework";
import { repository } from '../../../package.json';
import cl from '../../../changelogs.json';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import config from "../../config";

export class ChangeLog extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
        })
    }

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) => {
            return builder
            .setName('changelog')
            .setDescription('View the change log!')
            .setDMPermission(false)
        })
    }


    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(repository)
            .setLabel('Github')
            .setEmoji(config.emojis.apps.github.raw)
        );

        const commandsAddedFormated = cl.LATEST.commands_added.map((value) => `</${value.name}:${value.id}>\n- ${value.description}`).join('\n\n')

        const embed = new EmbedBuilder()
        .setAuthor({ name: this.container.client.user?.username!, iconURL: this.container.client.user?.displayAvatarURL() })
        .setDescription(`${cl.LATEST.header}\n${cl.LATEST.it_information}\n\n${commandsAddedFormated}\n\n**Audit log events::**`)
        .setFooter({ text: `${cl.LATEST.version}` })
        .setTimestamp()
        .setColor('Blurple');

        cl.LATEST.events_added.adds.forEach((value) => embed.addFields({ name: `${value.name}`, value: `${value.description}` }))

        interaction.editReply({ embeds: [embed], components: [row] });
    }
}