import { TextChannel } from "discord.js";
import { Event } from "../interfaces/Events";

export const event: Event = {
    name: "ready",
    run: async (bot) => {
        // Kazagumo node events
        bot.kazagumo.shoukaku.on("ready", (name) => {
            bot.consola.info("============================");
            bot.consola.success(`Lavalink ${name}: Ready!`);
            bot.consola.info("============================");
        });

        bot.kazagumo.shoukaku.on("error", (name, error) => {
            bot.consola.error(`Lavalink ${name}: Error Caught,`, error);
        });

        bot.kazagumo.shoukaku.on("close", (name, code, reason) =>
            bot.consola.warn(
                `Lavalink ${name}: Closed, Code ${code}, Reason ${
                    reason || "No reason"
                }`
            )
        );

        bot.kazagumo.shoukaku.on("debug", (name, info) =>
            bot.consola.debug(`Lavalink ${name}: Debug,`, info)
        );

        bot.kazagumo.shoukaku.on("disconnect", (name, players, moved) => {
            if (moved) return;
            players.map((player) => player.connection.disconnect());
            bot.consola.warn(`Lavalink ${name}: Disconnected`);
        });

        // Kazagumo player events
        bot.kazagumo.on("playerStart", (player, track) => {
            const channel = <TextChannel>bot.channels.cache.get(player.textId);

            channel
                .send({
                    content: `🎶Now playing **${track.title}** by **${track.author}**`,
                })
                .then((x) => player.data.set("message", x));
        });

        bot.kazagumo.on("playerEnd", (player) => {
            player.data.get("message")?.edit({ content: `Finished playing` });
        });

        bot.kazagumo.on("playerEmpty", (player) => {
            const channel = <TextChannel>bot.channels.cache.get(player.textId);

            channel
                .send({ content: `Queue is now empty!` })
                .then((x) => player.data.set("message", x));
        });

        bot.kazagumo.on("playerMoved", (player, state, channels) => {
            let channel = <TextChannel>bot.channels.cache.get(player.textId);

            switch (state) {
                case "JOINED": {
                    channel.send({
                        content: `✅ Joined ${channel}!`,
                    });
                    break;
                }
                case "LEFT": {
                    bot.consola.log(`I have left ${channels.oldChannelId}`);
                    player.destroy();
                    break;
                }

                case "MOVED": {
                    player.setTextChannel(channels.newChannelId);
                    channel = <TextChannel>(
                        bot.channels.cache.get(channels.newChannelId)
                    );
                    channel.send({
                        content: `✅ Moved to ${channel}!`,
                    });
                    break;
                }

                default:
                    break;
            }
        });
    },
};
