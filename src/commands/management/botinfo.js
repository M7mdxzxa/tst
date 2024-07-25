/* eslint-disable no-undef */
const Utils = require("../../modules/utils.js");
const { Embed } = Utils;
const { config } = Utils.variables;
const osUtils = require("os-utils");
const nodeOs = require("os");

module.exports = {
    name: 'botinfo',
    run: async (bot, messageOrInteraction, args, { reply }) => {
        return new Promise(async resolve => {
            const packages = require('../../../package.json');

            const os = process.platform;

            let os_name = "";
            if (os == "win32")
                os_name = "Windows";
            else if (os == "darwin")
                os_name = "MacOS";
            else os_name = os.charAt(0).toUpperCase() + os.slice(1);

            let corebotVersion = config.BotVersion;
            if (corebotVersion !== packages.version) corebotVersion = `\n> **Config.yml:** v${config.BotVersion}\n> **Package.json:** v${packages.version}`;
            else corebotVersion = `v${config.BotVersion}`;

            const usedMemDecimal = 1 - osUtils.freememPercentage();
            const usedMemPercentage = (usedMemDecimal * 100).toFixed(1);
            const memoryEmoji = usedMemPercentage < 50 ? ":green_circle:" : (usedMemPercentage < 90 ? ":yellow_circle:" : ":red_circle:");

            const memUsage = `${Math.round(osUtils.freemem())}/${Math.round(osUtils.totalmem())} MB`;
            const cpus = nodeOs.cpus();
            const cpuModel = cpus[0].model;
            const cpuSpeed = cpus[0].speed;

            const AddonHandler = require("../../modules/handlers/AddonHandler.js");
            const loadedAddons = AddonHandler.addons.filter(a => a.loaded).length;

            const CommandHandler = require("../../modules/handlers/CommandHandler.js");
            const enabledCommands = CommandHandler.commands.filter(c => c.enabled).length;

            const embed = Embed({
                author: {
                    text: bot.user.username,
                    icon: bot.user.displayAvatarURL({ dynamic: true })
                },
                fields: [
                    {
                        name: ":envelope_with_arrow: Versions",
                        value: `**Corebot:** ${corebotVersion}\n**Discord.js:** ${packages.dependencies["discord.js"]}\n**Node.js:** ${process.version}\nㅤ`,
                        inline: true
                    },
                    {
                        name: ":desktop: System",
                        value: `**Operating System:** ${os_name}\n**Online Since:** <t:${~~(Date.now() / 1000 - nodeOs.uptime)}:R>\n**CPU:**\n> **Model:** ${cpuModel}\n> **Speed:** ${(cpuSpeed / 1000).toFixed(1)} GHz\n${memoryEmoji} **Memory Usage:**\n> ${memUsage} (${usedMemPercentage}%)\nㅤ`,
                        inline: true
                    },
                    {
                        name: ":bar_chart: Stats",
                        value: `**Online Since:** <t:${~~((Date.now() - bot.uptime) / 1000)}:R>\n**Enabled Addons:** ${loadedAddons}\n**Enabled Commands:** ${enabledCommands}\n**Servers (${bot.guilds.cache.size}):**\n${bot.guilds.cache.map(server => `> \`\`${server.name}\`\``).join("\n")}\n**Users:** ${bot.users.cache.size}`,
                        inline: true
                    }
                ]
            });

            reply(embed);
            resolve(true);
        });
    },
    description: "View info about Corebot",
    usage: "botinfo",
    aliases: [],
    arguments: []
};
// CRACKED BY OGs