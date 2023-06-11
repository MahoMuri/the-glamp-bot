import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "skip",
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the song."),
    description: "Skips the song.",
    isAdmin: false,
    usage: "/skip",
    example: `\`\`\`fix
    /skip
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

        player.skip();
        bot.display.sendSuccessMessage("✅ Skipped the song.", interaction);
    },
};
