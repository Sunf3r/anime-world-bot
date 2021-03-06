import KetClient from "../../KetClient";

module.exports.CommandStructure = class CommandStructure {
    ket: KetClient;
    config: object;

    constructor(ket, command) {
        this.config = {
            name: command.name || null,
            aliases: command.aliases || [],
            category: command.category || "util",
            description: command.description || null,
            cooldown: command.cooldown || 3,
            permissions: command.permissions || {
                user: [],
                bot: [],
                roles: [],
                onlyDevs: false
            },
            access: command.access || {
                DM: false,
                Threads: false
            },
            dontType: command.dontType || false,
            testCommand: command.testCommand || [],
            data: command.data || null
        }
        this.ket = ket;
    }
}

module.exports.EmbedBuilder = class EmbedBuilder {
    fields: object[];
    author: object;
    description: string;
    color: number;
    file: object[];
    footer: object;
    image: any;
    timestamp: any;
    title: string;
    thumbnail: any;
    url: any;

    constructor() {
        this.fields = [];
        this.author = null;
        this.description = null;
        this.color = null;
        this.file = null;
        this.footer = null;
        this.image = null;
        this.timestamp = null;
        this.title = null;
        this.thumbnail = null;
        this.url = null;
    }
    setAuthor(name, icon_url, url = null) {
        this.author = { name, icon_url, url };
        return this;
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    setDescription(description, code = null) {
        this.description = description.toString().substring(0, 3072)
        if (code) this.description = `\`\`\`${code}\n${this.description}\n\`\`\``;
        return this;
    }
    addField(name, value, inline = false, code = null) {
        if (!name || this.fields.length >= 25) return this;
        if (!value) return;
        value = value.toString().substring(0, 1024);
        if (code) value = `\`\`\`${code}\n${value}\`\`\``;
        this.fields.push({ name: name.toString().substring(0, 256), value: value, inline });
        return this;
    }
    addBlankField(inline = false) {
        this.addField('\u200B', '\u200B', inline);
        return this;
    }
    setColor(color: any) {
        const colors = {
            red: "#ff1500",
            orange: "#ff8c00",
            yellow: "#fdff00",
            green: "#25ff00",
            hardgreen: "#0d7200",
            blue: "#2391ff",
            hardblue: "#0025ff",
            hardpurple: "#4b0082",
            purple: "#9400d3",
            pink: "#ff007f",
        };
        if (colors[color]) this.color = parseInt((colors[color]).replace('#', ''), 16);
        else this.color = parseInt((color.replace('#', '')), 16)
        return this;
    }
    setImage(image, height = null, width = null) {
        this.image = {
            url: image
        };
        if (height) this.image.height = height;
        if (width) this.image.width = width;
        return this;
    }
    setTimestamp(timestamp = new Date()) {
        this.timestamp = timestamp;
        return this;
    }
    setUrl(url) {
        this.url = url;
        return this;
    }
    setFooter(text, iconUrl = null) {
        this.footer = {
            text: text.toString().substring(0, 2048),
            icon_url: iconUrl
        };
        return this;
    }
    setThumbnail(url) {
        this.thumbnail = { url };
        return this;
    }
    build() {
        return this;
    }
}

export const Decoration = {
    getEmoji: function getEmoji(emoji: string) {
        let emojis = {
            autorizado: "<:autorizado:765952397595639828>",
            negado: "<:negado:765952453203984404>",
            badge: "<a:badge_black:935899201404043274>",
            errado: "<a:errado:935902056475140127>",
            add: "<:add:935899158697627678>",
            confirmar: "<:confirmar:919396264670539856>",
            cancelar: "<:cancelar:919396327140511804>",
            membro: "<:membro:935887811427598348>",
            um: "<:um:919424774944489513>",
            dois: "<:dois:919424797606285325>",
            tres: "<:tres:919424800877858816>",
            seta: "<:seta:919424706170462249>",
            setaRed: "<a:seta_direita:787491026830229534>",
            info: "<:info:919396379615432735>",
            registro: "<:w_registro:919424688642473994> ",
            ruby: "<a:ruby_bunitin:787108623771107348>",
            sireneBlue: "<a:emergencia2:783149286342787102>",
            sireneRed: "<a:emergencia:770106111381864458>",
            online: '<:online:817023347396706324>',
            idle: '<:idle:817023347723730944>',
            offline: '<:offline:817024931619274762>'
        };
        const emojiFilter = String(emojis[emoji]).replace('<a:', '').replace('<:', '').replace('>', '').trim().split(':')
        const emojiObj = {
            name: emojiFilter[0],
            id: (emojiFilter[1] !== undefined) ? emojiFilter[1] : emojiFilter[0],
            mention: String(emojis[emoji]),
            reaction: (emojiFilter[1] !== undefined) ? `${emojiFilter[0]}:${emojiFilter[1]}` : `${emojiFilter[0]}`
        }
        return emojiObj;
    },
    getColor: function getColor(color: string, toNumber = true) {
        const colors = {
            red: "#ff1500",
            orange: "#ff8c00",
            yellow: "#fdff00",
            green: "#25ff00",
            hardgreen: "#0d7200",
            blue: "#2391ff",
            hardblue: "#0025ff",
            hardpurple: "#4b0082",
            purple: "#9400d3",
            pink: "#ff007f",
        };
        if (colors[color]) {
            if (toNumber) return parseInt((colors[color]).replace('#', ''), 16);
            return colors[color];
        } else return parseInt((color.replace('#', '')), 16)
    }
}

module.exports.getContext = ({ ket, message = null, interaction = null, user, args = null, command = null, commandName = null }) => {
    let ctx = message ? message : interaction;
    return {
        ket: ket,
        config: ket.config,
        env: message ? message : interaction,
        user: user,
        args: args,
        author: (message ? ctx.author : ctx.member.user),
        uID: (message ? ctx.author : ctx.member.user).id,
        member: ctx.member,
        guild: ctx.channel.guild,
        gID: ctx.guildID,
        me: ctx.channel.guild.members.get(ket.user.id),
        shard: ctx.channel.guild.shard,
        channel: ctx.channel,
        cID: ctx.channel.id,
        command: command?.config,
        commandName: commandName
    }
}
