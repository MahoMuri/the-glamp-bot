import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "shuffle",
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffles the queue."),
    description: "Shuffles the queue.",
    isAdmin: false,
    usage: "/shuffle",
    example: `\`\`\`fix
    /shuffle
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

        player.queue.shuffle();
        bot.display.sendSuccessMessage("✅ Shuffled the queue.", interaction);
    },
};
