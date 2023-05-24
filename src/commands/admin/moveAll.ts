import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "moveall",
    data: new SlashCommandBuilder()
        .setName("moveall")
        .setDescription("Moves all active users to a different VC."),
    description: "Moves all active users to a different VC.",
    usage: "/moveAll <channel>",
    example: "/moveAll <voiceChannel>",
    run: async (bot, interaction) => {
        interaction.editReply({
            content: "Command Works!",
        });
    },
};
