import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { Qwik } from "../../Qwik";


export async function Event(interaction: ModalSubmitInteraction, client: Qwik) {
    if (!interaction.isModalSubmit()) return;

    const customId = interaction.customId.split('-');

    if (customId[1] === 'nickname') {
        const memberId = interaction.customId.split('-')[2];
        console.log(memberId);
        const member = await interaction.guild?.members.fetch(memberId);
        await member?.setNickname(interaction.fields.getTextInputValue('nickname-input'));

        const embed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`**Changed ${member?.user}'s nickname to:** ${member?.nickname}`)
        .setColor('Orange')
        .setTimestamp();

        interaction.reply({ content: '**✅ | Nickname Changed**', ephemeral: true });
        return interaction.message?.edit({ embeds: [embed], components: [] });
    }
}