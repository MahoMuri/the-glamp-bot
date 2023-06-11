import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "loop",
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Loops the song or the queue.")
        .addStringOption((option) =>
            option
                .setName("mode")
                .setDescription(
                    "Wether to loop the song, the queue or turn it off."
                )
                .addChoices(
                    { name: "None", value: "none" },
                    { name: "Queue", value: "queue" },
                    { name: "Song", value: "track" }
                )
                .setRequired(true)
        ),
    description: "Loops the song or the queue.",
    isAdmin: false,
    usage: "/loop",
    example: `\`\`\`fix
    /loop <none|song|queue>
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

        const mode = <"none" | "queue" | "track">(
            interaction.options.getString("mode", true)
        );

        player.setLoop(mode);
        bot.display.sendSuccessMessage("✅ Looped the queue.", interaction);
    },
};
