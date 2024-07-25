const Utils = require('../modules/utils.js');
const Embed = Utils.Embed;
const config = Utils.variables.config;
const lang = Utils.variables.lang;

module.exports = async (bot, oldMessage, newMessage) => {
    if (require('../modules/handlers/CommandHandler.js').commands.length > 0) {
        if (newMessage.channel.type == 'DM') return;
        if (config.Other.IgnoredGuilds.includes(newMessage.guild.id)) return;

        if (!oldMessage.channel || oldMessage.author.bot || oldMessage.content == newMessage.content) return;

        if (config.Logs.Enabled.includes("MessageEdited")) {
            let channel = Utils.findChannel(config.Logs.Channels.MessageEdited, oldMessage.guild);
            let embed = Embed({
                author: lang.LogSystem.MessageUpdated.Author,
                description: lang.LogSystem.MessageUpdated.Description
                    .replace(/{message-url}/g, newMessage.url)
                    .replace(/{user}/g, newMessage.member)
                    .replace(/{old}/g, Utils.Discord.Util.escapeMarkdown(oldMessage.content))
                    .replace(/{new}/g, Utils.Discord.Util.escapeMarkdown(newMessage.content))
                    .replace(/{time}/g, ~~(Date.now() / 1000))
            });

            channel.send(embed);
        }
        const antiAdvertisementCheck = async () => {
            // ANTI ADVERTISEMENT SYSTEM
            if (newMessage.content && Utils.hasAdvertisement(newMessage.content)) {
                if (config.AntiAdvertisement.Chat.Enabled && !Utils.hasPermission(newMessage.member, config.AntiAdvertisement.BypassRole)) {
                    if (["ticket-", "application-"].some(name => newMessage.channel.name.startsWith(name))) return;
                    if (config.AntiAdvertisement.Whitelist.Channels.some(channel => newMessage.channel.name == channel || newMessage.channel.id == channel)) return;

                    newMessage.delete();
                    newMessage.channel.send(Embed({ title: lang.AntiAdSystem.MessageAdDetected.Title, description: lang.AntiAdSystem.MessageAdDetected.Description.replace(/{user}/g, newMessage.author) })).then(Utils.delete);

                    if (config.AntiAdvertisement.Chat.Logs.Enabled) {
                        const logs = Utils.findChannel(config.AntiAdvertisement.Chat.Logs.Channel, newMessage.guild);

                        if (logs) logs.send(Embed({
                            author: lang.AntiAdSystem.Log.Author,
                            description: lang.AntiAdSystem.Log.Description
                                .replace(/{user}/g, newMessage.member)
                                .replace(/{channel}/g, newMessage.channel)
                                .replace(/{time}/g, ~~(Date.now() / 1000))
                                .replace(/{message}/g, newMessage.content
                                    .split(" ")
                                    .map(word => {
                                        if (word && Utils.hasAdvertisement(word)) return `**${word}**`;
                                        else return word;
                                    })
                                    .join(" "))
                        }));
                    }
                }
            }
        }

        const filterCheck = async () => {
            // FILTER SYSTEM
            const filterCommand = await Utils.variables.db.get.getCommands("filter");
            if (!filterCommand || !filterCommand.enabled) return;
            if (Utils.hasPermission(newMessage.member, config.Other.FilterBypassRole)) return;

            const filter = await Utils.variables.db.get.getFilter();
            const content = newMessage.content.toLowerCase();

            if (filter.some(word => content.includes(word.toLowerCase()))) {
                if (newMessage) newMessage.delete();

                if (Utils.variables.noAnnounceFilter.has(newMessage.member.id)) return;

                newMessage.channel.send(Object.assign({}, {
                    content: `<@${newMessage.member.id}>`
                }, Embed({
                    author: {
                        text: lang.FilterSystem.FilterSystem,
                        icon: "https://cdn.discordapp.com/attachments/689149005024067704/954111210394091570/emojisky.com-748566.png"
                    },
                    title: lang.FilterSystem.Filter.Title,
                    color: config.EmbedColors.Error,
                    timestamp: new Date()
                }))).then(m => Utils.delete(m, 7000));
            }
        }

        antiAdvertisementCheck();
        filterCheck();
    }
};
// CRACKED BY OGs