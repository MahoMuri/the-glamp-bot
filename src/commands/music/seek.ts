import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import toMilliseconds from "@sindresorhus/to-milliseconds";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "seek",
    data: new SlashCommandBuilder()
        .setName("seek")
        .setDescription("Sets the time of the track in the player.")
        .addStringOption((option) =>
            option
                .setName("time")
                .setDescription("The time to skip to.")
                .setRequired(true)
        ),
    description: "Sets the time of the track in the player.",
    isAdmin: false,
    usage: "/seek 2:30",
    example: `\`\`\`fix
    /seek 1:00
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

        const time = interaction.options.getString("time", true).match(/\d+/g);
        let milliseconds = 0;

        switch (time.length) {
            case 1:
                milliseconds = toMilliseconds({
                    seconds: +time[0],
                });
                break;
            case 2:
                milliseconds = toMilliseconds({
                    minutes: +time[0],
                    seconds: +time[1],
                });
                break;
            case 3:
                milliseconds = toMilliseconds({
                    hours: +time[0],
                    minutes: +time[1],
                    seconds: +time[2],
                });
                break;
            default:
                break;
        }

        player.seek(milliseconds);
        bot.display.sendSuccessMessage(`⏩ Seek to ${time}`, interaction);
    },
};
