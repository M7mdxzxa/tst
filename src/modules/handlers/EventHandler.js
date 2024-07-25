const Utils = require('../utils.js');
const { error } = require('../utils.js');
const fs = require('fs');
const chalk = require("chalk");

module.exports = {
    events: [],
    find: function (name) {
        this.events.find(e => e.name.toLowerCase() == name.toLowerCase());
    },
    set: function (name, event) {
        if (!name || !event || !['[object Function]', '[AsyncFunction]', '[object AsyncFunction]'].includes({}.toString.call(event))) return error('Invalid event object.');
        function CallEvent(...args) {
            try {
                // OBFSCUATE BEFORE RELEASE
                if (!["ready", "error", "commandsLoaded"].includes(name) && !require("./KeyHandler.js").m52hJwH65M) return;

                if (!["ready", "error", "commandsLoaded"].includes(name) ? (require('./CommandHandler.js').commands.length > 0) : true) {
                    event(require('../variables').bot, ...args);
                }
            } catch (err) {
                console.log(err);
            }
        }
        this.bot.on(name, CallEvent);

        const EventObject = {
            name,
            run: event,
            call: CallEvent
        };

        const caller = Utils.getLine(3) || "Unknown";

        if (caller.includes('addons')) {
            // eslint-disable-next-line no-useless-escape
            const name = caller.replace(/\\addons\\/g, '').match(/[^\.]+/)[0];
            EventObject.addonName = name;
        }

        this.events.push(EventObject);
    },
    init: function (bot) {
        this.bot = bot;
        fs.readdir('./src/events', function (err, files) {
            if (err) throw err;
            files
                .filter(f => f.endsWith('.js'))
                .forEach(event => {
                    try {
                        const e = require('../../events/' + event);
                        module.exports.set(event.split(".js")[0], e);
                    } catch (e) {
                        console.log(Utils.errorPrefix + "An unexpected error occured while loading the " + chalk.bold(event.slice(0, -3)) + " event! Please contact the Corebot support team. " + chalk.bold("https://corebot.dev/support"));
                        error(e.message, e.stack, undefined, false);
                    }
                });
            console.log(Utils.infoPrefix + module.exports.events.length + ' events have been loaded.');

            return module.exports;
        });
    }
};
// CRACKED BY OGs