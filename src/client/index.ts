import { Client, Collection, IntentsBitField } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import { consola } from "consola";
import { getBorderCharacters, table } from "table";
import { Kazagumo, Plugins } from "kazagumo";
import Spotify from "kazagumo-spotify";
import { Connectors, NodeOption } from "shoukaku";
import { Command } from "../interfaces/Command";
import { getEnvironmentConfiguration } from "../utils/EnvironmentConifg";
import { Colors } from "../interfaces/Colors";
import { Display } from "../utils/Display";

export class Bot extends Client {
    public categories = readdirSync(path.join(__dirname, "..", "commands"));

    public commands: Collection<string, Command> = new Collection();

    public events: Collection<string, Event> = new Collection();

    public config = getEnvironmentConfiguration();

    public consola = consola;

    public display: Display;

    public kazagumo: Kazagumo;

    static colors = Colors;

    // Constructor for intents
    constructor() {
        super({
            allowedMentions: {
                parse: ["users", "roles"],
            },
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildVoiceStates,
            ],
        });
    }

    async init() {
        await this.login(this.config.token);
        this.consola.withTag(`@${this.user.username}｜`);
        this.consola.wrapConsole();
        this.display = new Display(this);

        // Kazagumo client
        const nodes: NodeOption[] = [
            {
                name: "Node 1",
                url: this.config.host,
                auth: this.config.password,
                secure: true,
            },
        ];
        this.kazagumo = new Kazagumo(
            {
                defaultSearchEngine: "youtube",
                send: (guildId, payload) => {
                    const guild = this.guilds.cache.get(guildId);
                    if (guild) {
                        guild.shard.send(payload);
                    }
                },
                plugins: [
                    new Plugins.PlayerMoved(this),
                    new Spotify({
                        clientId: this.config.spotify_clientId,
                        clientSecret: this.config.spotify_clientSecret,
                    }),
                ],
            },
            new Connectors.DiscordJS(this),
            nodes
        );

        // Command registry
        const cmdTable = [];
        const commandsPath = path.join(__dirname, "..", "commands");
        this.categories.forEach((dir) => {
            const commands = readdirSync(`${commandsPath}/${dir}`).filter(
                (file) => file.endsWith(".ts")
            );

            commands.forEach((file) => {
                try {
                    const {
                        command,
                    } = require(`${commandsPath}/${dir}/${file}`);
                    this.commands.set(command.name, command);
                    cmdTable.push([file, "Loaded"]);
                } catch (error) {
                    cmdTable.push([file, `${error.message}`]);
                }
            });
        });

        // Event registry
        const eventTable = [];
        const eventsPath = path.join(__dirname, "..", "events");
        readdirSync(eventsPath).forEach((file) => {
            try {
                const { event } = require(`${eventsPath}/${file}`);
                this.events.set(event.name, event);
                this.on(event.name, event.run.bind(null, this));

                eventTable.push([file, "Loaded"]);
            } catch (error) {
                eventTable.push([file, `${error.message}`]);
            }
        });
        this.consola.log(
            `${table(cmdTable, {
                border: getBorderCharacters("norc"),
                header: {
                    alignment: "center",
                    content: "Commands",
                },
            })}${table(eventTable, {
                border: getBorderCharacters("norc"),
                header: {
                    alignment: "center",
                    content: "Events",
                },
            })}`
        );
    }
}
