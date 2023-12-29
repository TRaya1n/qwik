import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Qwik } from "../../Qwik/index";

export const SlashCommand = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Returns bot ping!'),
    execute: async (client: Qwik, interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        interaction.editReply({ content: `\`Loading data...\`` });

        if (client.ws.ping === -1) {
            const embed = new EmbedBuilder()
            .setAuthor({ name: `${client.user?.username}`, iconURL: client.user?.displayAvatarURL() })
            .setDescription(`**The bot was recently restarted, please wait a few minutes before trying again!**`)
            .setColor('Orange')
            .setTimestamp();

            return interaction.editReply({ content: null, embeds: [embed] });
        }

        const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user?.username}`, iconURL: client.user?.displayAvatarURL() })
        .setDescription(`**Ping:** ${client.ws.ping}ms`)
        .setColor('Greyple')
        .setTimestamp();

        return interaction.editReply({ content: null, embeds: [embed] });
    }
}