import djs, { messageLink } from 'discord.js';
import axios from 'axios';

export type FactTypes = "useless";
export const getFactAPITypes = ["useless"];

interface getFactOptions {
    type: FactTypes | string;
    embed: boolean;
    message?: djs.Message | djs.ChatInputCommandInteraction;
    data?: {
        target?: djs.User,
        footer: boolean,
        color: djs.ColorResolvable;
        timestamp?: boolean;
    }
}

export async function getFact(options: getFactOptions) {
    if (options.type === "useless") {
        await UselessFact(options)
    }
}

async function UselessFact(options: getFactOptions) {
    const response = await axios({
        url: `https://uselessfacts.jsph.pl/api/v2/facts/random?language=en`,
        method: 'GET'
    });

    const id = response.data.id;
    const text = response.data.text;
    const source = response.data.source;

    if (options.embed) {
        const embed = new djs.EmbedBuilder()
        
        if (options.data?.color) {
            embed.setColor(options.data.color);
        }

        if (options.data?.footer) {
            embed.setFooter({ text: `${id} | ${source}` });
        }

        if (options.data?.timestamp) {
            embed.setTimestamp()
        }

        if (options.data?.target) {
            embed.setAuthor({ name: options.data.target.username, iconURL: options.data.target.displayAvatarURL() });
        }

        embed.setDescription(`${text}`)

        if (options.message instanceof djs.Message) {
            options.message.reply({ embeds: [embed] }) 
        } else {
            if (options.message?.deferred) {
                options.message.editReply({ embeds: [embed] });
            } else {
                options.message?.reply({ embeds: [embed] });
            }
        }
    }

    return {
        id,
        text, 
        source
    }
}