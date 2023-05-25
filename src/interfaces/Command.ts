import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { Bot } from "../client";

interface Run {
    (
        bot: Bot,
        interaction: ChatInputCommandInteraction<"cached"> | ButtonInteraction
    );
}

export interface Command {
    name: string;
    data:
        | SlashCommandBuilder
        | SlashCommandSubcommandsOnlyBuilder
        | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    description: string;
    isAdmin: boolean;
    usage: string;
    example: string;
    placeholders?: string;
    run: Run;
}
