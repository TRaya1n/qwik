import djs from "discord.js";

interface EightBallOptions {
  embed?: boolean;
  embed_options?: {
    color: djs.ColorResolvable;
    timestamp?: boolean;
  };
  target?: djs.User;
  message?: djs.Message | djs.ChatInputCommandInteraction;
  message_options?: {
    ephemeral: boolean;
  };
}

/**
 * @param {string} question
 * @param {EightBallOptions} options
 */
export function EightBall(question: string, options?: EightBallOptions) {
  const answers = [
    "yes",
    "maybe",
    "absolutely",
    "probably",
    "no",
    "maybe not",
    "i don't know",
  ][Math.floor(Math.random() * 7 + 1)];

  if (options && options.embed) {
    const embed = new djs.EmbedBuilder();
    if (options.target instanceof djs.User) {
      embed.setAuthor({
        name: options.target.username,
        iconURL: options.target.displayAvatarURL(),
      });
    }

    if (options.embed_options) {
      embed.setColor(options.embed_options.color);
      if (options.embed_options.timestamp) {
        embed.setTimestamp();
      }
    }

    embed.addFields(
      {
        name: "Question:",
        value: `${question.endsWith("?") ? question : question + "?"}`,
      },
      {
        name: "Answer:",
        value: `${answers}`,
      },
    );

    if (options.message) {
      if (options.message instanceof djs.Message) {
        options.message.reply({ embeds: [embed] });
        return {
          question,
          answers,
        };
      } else {
        if (options.message.deferred) {
          options.message.editReply({ embeds: [embed] });
          return {
            question,
            answers,
          };
        } else {
          const ephemeral = options.message_options
            ? options.message_options.ephemeral
            : false;
          options.message.reply({ embeds: [embed], ephemeral });
          return {
            question,
            answers,
          };
        }
      }
    } else {
      return {
        embed: embed,
        question,
        answers,
      };
    }
  }

  return {
    question,
    answers,
  };
}
