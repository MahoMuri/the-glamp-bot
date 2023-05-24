import { ActivityType, REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import { Event } from "../interfaces/Events";

export const event: Event = {
    name: "ready",
    run: async (bot) => {
        bot.user.setActivity(" with Maho | /help", {
            type: ActivityType.Playing,
        });

        // Slashcommand registry
        const commands = [];
        const clientId = bot.application.id;
        const hiddenCommands = ["sudo", "test"];

        bot.categories.forEach((dir) => {
            const commandFiles = readdirSync(
                path.resolve(`src/commands/${dir}`)
            ).filter((file) => file.endsWith(".ts"));
            commandFiles.forEach((file) => {
                const { command: cmd } = require(`../commands/${dir}/${file}`);
                if (bot.config.mode === "production") {
                    if (cmd.data && !hiddenCommands.includes(cmd.name)) {
                        commands.push(cmd.data.toJSON());
                    }
                    return;
                }
                if (cmd.data) {
                    commands.push(cmd.data.toJSON());
                }
            });
        });

        const TOKEN = bot.config.token;
        const rest = new REST().setToken(TOKEN);

        try {
            bot.consola.start("Started loading slash commands...");
            await rest.put(
                Routes.applicationGuildCommands(clientId, process.env.GUILD),
                {
                    body: commands,
                }
            );
            bot.consola.info("============================");
            bot.consola.success("Guild slash commands loaded!");
            bot.consola.info("============================");
        } catch (error) {
            bot.consola.error(error);
        }

        bot.consola.success(`${bot.user.username} is Online!`);
    },
};
