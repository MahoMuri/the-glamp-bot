import prettyMilliseconds from "pretty-ms";
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { capitalize } from "lodash";
import { pagination } from "@devraelfreeze/discordjs-pagination";
import ms from "ms";
import { Command } from "../../interfaces/Command";
import { Bot } from "../../client";

export const command: Command = {
    name: "queue",
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows current queue."),
    description: "Shows current queue.",
    isAdmin: false,
    usage: "/queue",
    example: `\`\`\`fix
    /queue
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

        if (!player.queue.current || player.queue.isEmpty) {
            bot.display.sendErrorMessage(
                "❌ There is no music playing.",
                interaction
            );
            return;
        }

        const { queue } = player;

        const songList = [];
        queue.forEach((item, iterator) => {
            let list: string;
            if (songList.length === 0) {
                list = `__**Now Playing:**__\n${iterator + 1}. [${
                    item.title
                }](${item.uri}) | \`${prettyMilliseconds(item.length, {
                    colonNotation: true,
                    secondsDecimalDigits: 0,
                })}\` | \`Requested by: ${item.author}\n\`\n`;
            } else if (songList.length === 1) {
                list = `__**Up next:**__\n${iterator + 1}. [${item.title}](${
                    item.uri
                }) | \`${prettyMilliseconds(item.length, {
                    colonNotation: true,
                    secondsDecimalDigits: 0,
                })}\` | \`Requested by: ${item.author}\n\``;
            } else {
                list = `${iterator + 1}. [${item.title}](${
                    item.uri
                }) | \`${prettyMilliseconds(item.length, {
                    colonNotation: true,
                    secondsDecimalDigits: 0,
                })}\` | \`Requested by: ${item.author}\n\``;
            }

            songList.push(list);
        });

        const footerMessage = `${queue.length} song${
            queue.length === 1 ? "" : "s"
        } in queue | Queue Duration: ${prettyMilliseconds(
            queue.durationLength,
            {
                colonNotation: true,
                secondsDecimalDigits: 0,
            }
        )}`;

        // Push all embed pages for embed pagination
        const embeds = [];
        const pages = Math.ceil(queue.length / 10); // Rounds off to the smallest integer greater than or equal to its numeric argument.
        // Page items
        let start = 0;
        let end = 10;

        // limits the description to 10 items per page
        for (let i = 0; i < pages; i += 1)
            if (i < 1) {
                embeds.push(
                    new EmbedBuilder()
                        .setTitle(
                            `Queue for ${
                                interaction.guild.name
                            } | Loop Status: ${capitalize(player.loop)}`
                        )
                        .setColor(Bot.colors.GREEN_SHEEN)
                        .setDescription(songList.slice(start, end).join("\n"))
                        .setFooter({
                            text: `Page: ${i + 1}/${pages} | ${footerMessage}`,
                        })
                );
            } else {
                embeds.push(
                    new EmbedBuilder()
                        .setTitle(`Queue for ${interaction.guild.name}`)
                        .setColor(Bot.colors.GREEN_SHEEN)
                        .setDescription(
                            songList
                                .slice((start += 10), (end += 10))
                                .join("\n")
                        )
                        .setFooter({
                            text: `Page: ${i + 1}/${pages} | ${footerMessage}`,
                        })
                );
            }

        await pagination({
            embeds,
            author: interaction.member.user,
            time: ms("1m"),
            disableButtons: false,
            fastSkip: true,
            pageTravel: true,
        });
    },
};
