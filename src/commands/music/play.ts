import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "play",
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song.")
        .addStringOption((option) =>
            option
                .setName("song")
                .setDescription("The song to play.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("engine")
                .setDescription(
                    "Tells the bot what search engine to use. Defaults to Youtube."
                )
                .addChoices(
                    { name: "YouTube", value: "youtube" },
                    { name: "Spotify", value: "spotify" }
                )
        ),
    isAdmin: false,
    description: "Plays a song.",
    usage: "/play",
    example: `\`\`\`fix
    /play <songName|url>
    \`\`\``,
    run: async (bot, interaction: ChatInputCommandInteraction<"cached">) => {
        let player = bot.kazagumo.getPlayer(interaction.guildId);

        if (!player) {
            player = await bot.kazagumo.createPlayer({
                guildId: interaction.guildId,
                textId: interaction.channelId,
                voiceId: interaction.member.voice.channelId,
            });
        }

        const song = interaction.options.getString("song", true);
        const engine = interaction.options.getString("engine") || "youtube";

        const result = await player.search(song, {
            requester: interaction.user,
            engine,
        });

        if (!result.tracks.length) {
            bot.display.sendErrorMessage("❌ No results found!", interaction);
            return;
        }

        if (result.type === "PLAYLIST") {
            player.queue.add(result.tracks);
            bot.display.sendSuccessMessage(
                `✅ Added ${result.tracks.length} songs to the queue!`,
                interaction
            );
        } else {
            player.queue.add(result.tracks[0]);
            bot.display.sendSuccessMessage(
                `✅ Added ${result.tracks[0].title} to the queue!`,
                interaction
            );
        }
        if (!player.playing && !player.paused) {
            player.play();
        }
    },
};
