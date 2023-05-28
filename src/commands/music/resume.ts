import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "resume",
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the player."),
    description: "Resumes the player.",
    isAdmin: false,
    usage: "/resume",
    example: `\`\`\`fix
    /resume
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

        player.pause(false);
        bot.display.sendSuccessMessage("✅ Resumed the player.", interaction);
    },
};
