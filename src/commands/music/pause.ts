import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "pause",
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the player."),
    description: "Pauses the player.",
    isAdmin: false,
    usage: "/pause",
    example: `\`\`\`fix
    /pause
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

        player.pause(true);
        bot.display.sendSuccessMessage("✅ Paused the player.", interaction);
    },
};
