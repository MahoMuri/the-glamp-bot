import {
    ChannelType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    VoiceChannel,
} from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "move",
    data: new SlashCommandBuilder()
        .setName("move")
        .setDescription("Moves one or all active users to a different VC.")
        .addSubcommand((subCommand) =>
            subCommand
                .setName("user")
                .setDescription("Moves a user to a voice channel")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user to move.")
                        .setRequired(true)
                )
                .addChannelOption((option) =>
                    option
                        .addChannelTypes(ChannelType.GuildVoice)
                        .setName("channel")
                        .setDescription("The voice channel to move the user.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("all")
                .setDescription("Moves all active users to a voice channel")
                .addChannelOption((option) =>
                    option
                        .addChannelTypes(ChannelType.GuildVoice)
                        .setName("channel")
                        .setDescription("The voice channel to move the users.")
                        .setRequired(true)
                )
        ),
    isAdmin: true,
    description: "Moves all active users to a different VC.",
    usage: "/move <user|all> <channel>",
    example: `\`\`\`fix
    /move @MahoMuri  <voiceChannel>
    /move all <voiceChannel>
    \`\`\`
    `,
    run: async (bot, interaction: ChatInputCommandInteraction<"cached">) => {
        const { member } = interaction;

        if (!member?.voice.channel) {
            bot.display.sendErrorMessage(
                "❌ You must be in a voice channel to use this command.",
                interaction
            );
            return;
        }

        const mode = interaction.options.getSubcommand();

        const channel = <VoiceChannel>(
            interaction.options.getChannel("channel", true)
        );

        let counter = 0;

        switch (mode) {
            case "user": {
                const toMove = interaction.options.getMember("user");
                toMove.voice.setChannel(channel);
                counter += 1;
                break;
            }

            case "all":
                member.voice.channel.members.forEach((currMember) => {
                    if (!currMember.voice.deaf) {
                        currMember.voice.setChannel(channel);
                        counter += 1;
                    }
                });
                break;
            default:
                break;
        }

        interaction.editReply({
            content: `✅ Successfully moved ${counter} user${
                counter === 1 ? "" : "s"
            }!`,
        });
    },
};
