import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    DiscordAPIError,
    EmbedBuilder,
    Message,
} from "discord.js";
import { stripIndents } from "common-tags";
import { Bot } from "../client";

export class Display {
    private bot: Bot;

    constructor(bot: Bot) {
        this.bot = bot;
    }

    sendErrorMessage(
        message: string,
        interaction: ChatInputCommandInteraction<"cached"> | ButtonInteraction,
        ephemeral = false
    ) {
        const embed = new EmbedBuilder()
            .setColor(Bot.colors.RED)
            .setDescription(message);

        if (interaction.replied || interaction.deferred) {
            interaction
                .editReply({ embeds: [embed] })
                .then((msg: Message) => {
                    setTimeout(() => {
                        msg.delete().catch((err: DiscordAPIError) => {
                            if (!err.name.includes("CHANNEL_NOT_CACHED")) {
                                this.bot.consola.error(err);
                            }
                        });
                    }, 10000);
                })
                .catch((err) => {
                    this.bot.consola.error(
                        stripIndents`Message failed to send due to ${err.name}: ${err.message}`
                    );
                });
        } else {
            interaction.reply({ embeds: [embed], ephemeral }).catch((err) => {
                this.bot.consola.error(err);
                // this.logError(bot, err, interaction.guild);
            });
        }
    }

    sendSuccessMessage(
        message: string,
        interaction: ChatInputCommandInteraction<"cached"> | ButtonInteraction
    ) {
        const embed = new EmbedBuilder()
            .setColor(Bot.colors.GREEN_SHEEN)
            .setDescription(message);

        if (interaction.replied || interaction.deferred) {
            interaction
                .editReply({ embeds: [embed] })
                .then((msg: Message) => {
                    setTimeout(() => {
                        msg.delete().catch((err: DiscordAPIError) => {
                            if (!err.name.includes("CHANNEL_NOT_CACHED")) {
                                this.bot.consola.error(err);
                            }
                        });
                    }, 10000);
                })
                .catch((err) => {
                    this.bot.consola.error(
                        stripIndents`Message failed to send due to ${err.name}: ${err.message}`
                    );
                });
        } else {
            interaction.reply({ embeds: [embed] }).catch((err) => {
                this.bot.consola.error(err);
                // this.logError(bot, err, interaction.guild);
            });
        }
    }
}
