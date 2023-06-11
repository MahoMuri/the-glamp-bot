import prettyMilliseconds from "pretty-ms";
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    channelMention,
} from "discord.js";
import { capitalize } from "lodash";
import { stripIndents } from "common-tags";
import { Command } from "../../interfaces/Command";
import { Bot } from "../../client";

export const command: Command = {
    name: "nowplaying",
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Shows the current playing song."),
    description: "Shows the current playing song.",
    isAdmin: false,
    usage: "/nowplaying",
    example: `\`\`\`fix
    /nowplaying
    \`\`\``,
    run: async (bot, interaction: ChatInputCommandInteraction<"cached">) => {
        const player = bot.kazagumo.getPlayer(interaction.guildId);

        if (!player) {
            bot.display.sendErrorMessage(
                "❌ There is no player for this guild.",
                interaction
            );
            return;
        }

        if (!player.queue.current) {
            bot.display.sendErrorMessage(
                "❌ There is no music playing.",
                interaction
            );
            return;
        }

        const { current } = player.queue;
        const next = player.queue[0];
        const charArray = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
        const trackLine = charArray.split("");
        const curPos = Math.floor(
            (player.position / current.length) * trackLine.length
        );
        trackLine.splice(curPos, 1, "🔘");

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "Now playing",
            })
            .setColor(Bot.colors.TURQUOISE)
            .setDescription(
                stripIndents`**[${current.title}](${
                    current.uri
                })**\n\n${trackLine.join("")}\n\u2800`
            )
            .addFields(
                {
                    name: "Song Duration:",
                    value: `\`${prettyMilliseconds(player.position, {
                        colonNotation: true,
                        secondsDecimalDigits: 0,
                    })}/${prettyMilliseconds(current.length, {
                        colonNotation: true,
                        secondsDecimalDigits: 0,
                    })}\``,
                    inline: true,
                },
                {
                    name: "Requested by:",
                    value: `${current.requester}`,
                    inline: true,
                },
                {
                    name: "Paused:",
                    value: player.paused ? "Yes" : "No",
                    inline: true,
                },
                {
                    name: "Loop mode:",
                    value: capitalize(player.loop),
                    inline: true,
                },
                {
                    name: "Channel:",
                    value: channelMention(player.voiceId),
                    inline: true,
                },
                {
                    name: "Up next:",
                    value: `${
                        next
                            ? `[${player.queue[0].title}](${player.queue[0].uri})`
                            : "Nothing"
                    }`,
                    inline: true,
                }
            )
            .setThumbnail(current.thumbnail);

        interaction.editReply({
            embeds: [embed],
        });
    },
};
