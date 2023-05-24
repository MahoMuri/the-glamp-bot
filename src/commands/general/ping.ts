import {
    ColorResolvable,
    Message,
    EmbedBuilder,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    formatEmoji,
} from "discord.js";
import { Bot } from "../../client";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "ping",
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Send a pong!"),
    description: "The ping command",
    usage: "/ping",
    example: `
    \`\`\`fix
    /ping
    \`\`\`
    `,
    run: async (bot, interaction: ChatInputCommandInteraction<"cached">) => {
        const msg = <Message>await interaction.editReply({
            content: `🏓 Pinging....`,
        });

        const wsping = bot.ws.ping;
        const apiping = msg.createdTimestamp - interaction.createdTimestamp;
        let wsemoji: string;
        let apiemoji: string;
        let color: ColorResolvable;

        if (apiping > 500) {
            apiemoji = formatEmoji("937716033446359071");
            color = Bot.colors.UPSDELL_RED;
        } else if (apiping >= 100) {
            apiemoji = formatEmoji("937715984045854801");
            color = Bot.colors.DEEP_SAFFRON;
        } else {
            apiemoji = formatEmoji("937715876801683466");
            color = Bot.colors.GREEN_MUNSEL;
        }

        if (wsping > 500) {
            wsemoji = formatEmoji("937716033446359071");
        } else if (wsping >= 100) {
            wsemoji = formatEmoji("937715984045854801");
        } else {
            wsemoji = formatEmoji("937715876801683466");
        }

        const pingEmbed: any = new EmbedBuilder()
            .setColor(color)
            .addFields(
                {
                    name: "API Ping:",
                    value: `${apiemoji} ${apiping}ms`,
                },
                {
                    name: "Websocket Ping:",
                    value: `${wsemoji} ${wsping}ms`,
                }
            )
            .setFooter({ text: `${bot.user.username} | MahoMuri ` })
            .setTimestamp();

        interaction.editReply({ embeds: [pingEmbed], content: "🏓 Pong" });
    },
};
