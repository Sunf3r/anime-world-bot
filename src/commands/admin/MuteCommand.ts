import { SlashCommandBuilder } from "@discordjs/builders";
import { Emoji, Member, Message } from "eris";
import KetClient from "../../KetClient";
import EventCollector from "../../components/Commands/EventCollector";

const { CommandStructure, Decoration } = require('../../components/Commands/CommandStructure'),
    { getEmoji, getColor } = Decoration,
    moment = require('moment');

module.exports = class MuteCommand extends CommandStructure {
    ket: KetClient;
    constructor(ket: KetClient) {
        super(ket, {
            name: 'mute',
            aliases: ['mutar', 'silenciar'],
            category: 'admin',
            description: "Coloca um tampão na boca dos vagabundos",
            cooldown: 1,
            permissions: {
                user: [],
                bot: ['administrator'],
                onlyDevs: false
            },
            access: {
                DM: false,
                Threads: true
            },
            dontType: false,
            data: new SlashCommandBuilder()
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to be muted')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("duration")
                        .setDescription("The duration of punishment")
                        .setRequired(true)
                )
        })
    }
    async execute(ctx) {
        const member: any = await this.ket.findUser(ctx.env, ctx.args[0], true);

        if (!member || member.id === ctx.uID || !ctx.args[1]) return this.ket.send({ context: ctx.env, emoji: 'negado', content: `Comando incompleto, a maneira certa de usar é: \`${ctx.user.prefix}${ctx.commandName} @${ctx.author.tag} 1h 10m 4s\`` });

        let msg = await this.ket.send({
            context: ctx.env, content: {
                embeds: [{
                    title: `🔇 | Você está prestes a mutar ${member.user.username}`,
                    color: getColor('purple'),
                    thumbnail: { url: member.user.dynamicAvatarURL('jpg') },
                    description: `${getEmoji('info').mention} | Tem certeza de que deseja fazer isso? Ele será desconectado das calls e ficará impedido de conversar em chats do servidor.`,
                }]
            }
        })
        await msg.addReaction(getEmoji('confirmar').reaction).catch(() => { });
        await msg.addReaction(getEmoji('cancelar').reaction).catch(() => { });

        const filter = async (msgConfirm: Message, emoji: Emoji, reactor: Member) => {
            if (msgConfirm.id != msg.id || (emoji.id !== getEmoji('confirmar').id && emoji.id !== getEmoji('cancelar').id) || reactor.user.id !== ctx.uID) return false;
            await msgConfirm.removeReactions().catch(() => { });

            switch (emoji.id) {
                case getEmoji('confirmar').id:
                    member.mute(ctx.args[1], `Punido por: ${ctx.author.tag}`).then((time: number) => {
                        msg.edit({
                            embeds: [{
                                title: `Usuário silenciado!`,
                                color: getColor('pink'),
                                thumbnail: { url: member.user.dynamicAvatarURL('jpg') },
                                description: `${member.user.mention} foi silenciado por \`${moment.duration(time - Date.now()).format('dd[d] hh[h] mm[m] ss[s]')}\``,
                            }]
                        })
                    }).catch(() => { });
                    break
                case getEmoji('cancelar').id:
                    msg.edit({
                        embeds: [{
                            title: `Operação cancelada`,
                            color: getColor('red'),
                            thumbnail: { url: member.user.dynamicAvatarURL('jpg') },
                            description: `${member.user.mention} se salvou dessa vez... Mas não faça coisas erradas novamente.`,
                        }]
                    })
                    break
            }
            EventCollector.stop()
        }

        EventCollector.collect(this.ket, 'messageReactionAdd', filter, 120_000, () => msg.delete().catch(() => { }))

    }
}