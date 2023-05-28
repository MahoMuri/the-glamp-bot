import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "stop",
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stops the player and empties the queue."),
    description: "Stops the player and empties the queue.",
    isAdmin: false,
    usage: "/stop",
    example: `\`\`\`fix
    /stop
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

        player.queue.clear();
        player.skip();
        bot.display.sendSuccessMessage("✅ Stopped the player.", interaction);
    },
};
