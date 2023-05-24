import { ChatInputCommandInteraction } from "discord.js";
import { Event } from "../interfaces/Events";

export const event: Event = {
    name: "interactionCreate",
    run: async (bot, interaction: ChatInputCommandInteraction<"cached">) => {
        if (!interaction.isChatInputCommand()) return;

        const command = bot.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await interaction.deferReply();
            await command.run(bot, interaction);
        } catch (error) {
            bot.consola.error(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    },
};
