const Utils = require("../../utils");
const { variables: { config }, Embed } = Utils;

module.exports = async (messageOrInteraction, type, message, interaction, user, channel, guild, reply, member, validPrefixes, prefixFound, commandName, command) => {
    return new Promise(async (resolve, reject) => {
        if (!config.BugReports.Enabled) return resolve();
        if (![channel.name, channel.id].includes(config.BugReports.Channels.Pending)) return resolve();

        if (interaction && command.command !== "bnote") {
            reply(Embed({ preset: "error", description: "You cannot use slash commands in this channel" })).then(Utils.delete);
            return reject();
        }

        if (type == "message" && messageOrInteraction && command ? command.command !== "bnote" : true) {
            if (["revivenode", "send-message", "both"].includes(config.BugReports.Type.toLowerCase())) {
                if (messageOrInteraction.attachments.size) {
                    const imageLogs = Utils.findChannel(config.Channels.ImageLogs, messageOrInteraction.guild, 'GUILD_TEXT');
                    const attachment = messageOrInteraction.attachments.first();

                    if (imageLogs) {
                        imageLogs.send(attachment)
                            .then(m => {
                                messageOrInteraction.delete();

                                require("../createBugreport")(messageOrInteraction.content, messageOrInteraction.member, m.attachments.first());
                                return reject();
                            });
                    } else {
                        reply(Embed({ preset: "console" }));
                        return reject();
                    }
                } else
                    messageOrInteraction.delete();

                require("../createBugreport")(messageOrInteraction.content, messageOrInteraction.member);
                return reject();
            }
        }

        return resolve();
    });
};
// CRACKED BY OGs