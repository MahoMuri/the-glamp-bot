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

        if (!player || !player.playing) {
            bot.display.sendErrorMessage(
                "❌ There is nothing playing!",
                interaction
            );
            return;
        }

        if (player.queue.isEmpty) {
            bot.display.sendErrorMessage("❌ The queue is empty!", interaction);
            return;
        }

        const { queue } = player;

        const songList = [];
        // // Push the current song
        // songList.push(
        //     `__**Now Playing:**__\n[${queue.current.title}](${
        //         queue.current.uri
        //     }) | \`${prettyMilliseconds(queue.current.length, {
        //         colonNotation: true,
        //         secondsDecimalDigits: 0,
        //     })}\` | \`Requested by: ${queue.current.author}\`\n\n`
        // );

        // Push the songs to the songList
        queue.forEach((item, iterator) => {
            let list: string;
            if (songList.length === 0) {
                list = `__**Up next:**__\n${iterator + 1}. [${item.title}](${
                    item.uri
                }) | \`${prettyMilliseconds(item.length, {
                    colonNotation: true,
                    secondsDecimalDigits: 0,
                })}\` | \`Requested by: ${item.requester}\`\n`;
            } else {
                list = `${iterator + 1}. [${item.title}](${
                    item.uri
                }) | \`${prettyMilliseconds(item.length, {
                    colonNotation: true,
                    secondsDecimalDigits: 0,
                })}\` | \`Requested by: ${item.requester}\`\n`;
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
            interaction,
            time: ms("1m"),
            disableButtons: false,
            fastSkip: true,
            pageTravel: true,
        });
    },
};
