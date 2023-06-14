import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "avatar",
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Gets the user's avatar.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to get the avatar from.")
        ),
    description: "Gets the user's avatar.",
    isAdmin: false,
    usage: "/avatar <@user>",
    example: `\`\`\`fix
    /avatar
    /avatar @MahoMuri
    \`\`\``,
    run: async (bot, interaction: ChatInputCommandInteraction<"cached">) => {
        const user = interaction.options.getUser("user") || interaction.user;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL(),
            })
            .setDescription(
                `**[Avatar](${user.displayAvatarURL({ size: 2048 })})**`
            )
            .setImage(user.displayAvatarURL({ size: 2048 }));

        interaction.editReply({ embeds: [embed] });
    },
};
