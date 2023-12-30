import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Qwik } from "../../Qwik";


export const SlashCommand = {
    data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('See how long the bot has been up for!'),
    execute: async (client: Qwik, interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        interaction.editReply({ content: `\`Loading data...\`` });

        const embed = new EmbedBuilder()
        .setAuthor({ name: interaction.user?.username.toString(), iconURL: interaction.user?.displayAvatarURL() })
        .setDescription(`**Uptime:** ${client.uptimeQwik()}`)
        .setColor('Greyple')
        .setTimestamp();

        return interaction.editReply({ content: null, embeds: [embed] });
    }
}