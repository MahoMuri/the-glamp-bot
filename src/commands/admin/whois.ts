import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    roleMention,
    userMention,
} from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "whois",
    data: new SlashCommandBuilder()
        .setName("whois")
        .setDescription("Gives a detailed description of a user.")
        .addUserOption((option) =>
            option.setName("user").setDescription("The user to retrieve.")
        ),
    description: "Gives a detailed description of a user.",
    isAdmin: true,
    usage: "/whois <@member>",
    example: `\`\`\`fix
    /whois @MahoMuri
    \`\`\``,
    run: async (bot, interaction: ChatInputCommandInteraction<"cached">) => {
        const user = interaction.options.getUser("user") || interaction.user;
        const member = await interaction.guild.members.fetch(user);

        const roles = member.roles.cache
            .filter((role) => role.id !== interaction.guild.roles.everyone.id)
            .map((role) => roleMention(role.id));

        const permissions = member.permissions.toArray();
        console.log(permissions);

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Info`)
            .setDescription(`${userMention(user.id)}`)
            .addFields({
                name: "Roles",
                value: roles.join(", "),
            })
            .setThumbnail(user.displayAvatarURL())
            .setFooter({
                text: `${interaction.guild.name}`,
                iconURL: interaction.guild.iconURL(),
            });
        interaction.editReply({ embeds: [embed] });
    },
};
