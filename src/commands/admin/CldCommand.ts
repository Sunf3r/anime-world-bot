export { };
import KetClient from "../../KetClient";
import { SlashCommandBuilder } from "@discordjs/builders";
import { execSync } from "child_process";
import { inspect } from "util";
const { CommandStructure, EmbedBuilder } = require('../../components/Commands/CommandStructure');

module.exports = class CldCommand extends CommandStructure {
    constructor(ket: KetClient) {
        super(ket, {
            name: 'cld',
            aliases: [],
            category: 'admin',
            cooldown: 1,
            permissions: {
                user: [],
                bot: [],
                roles: [],
                onlyDevs: true
            },
            access: {
                DM: true,
                Threads: true
            },
            dontType: false,
            testCommand: ['node -v'],
            data: new SlashCommandBuilder()
        })
    }
    async execute(ctx) {
        let embed: typeof EmbedBuilder = new EmbedBuilder();

        try {
            let data = await execSync(ctx.args.join(' '));
            embed
                .setTitle('Só sucexo bb')
                .setColor('green')
                .setDescription(data, 'bash');
        } catch (e) {
            embed
                .setTitle('Ih deu merda viado')
                .setColor('red')
                .setDescription(inspect(e), 'bash');
        }
        return this.ket.send({ context: ctx.env, content: { embeds: [embed.build()] } })
    }
}