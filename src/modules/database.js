/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
let Utils = {};

module.exports = {
    mysql: {

    },
    sqlite: {

    },
    setup: async (config, bot) => {
        return new Promise(async (resolve, reject) => {
            Utils = require('./utils.js');
            let type = config.Storage.Type;
            if (!['sqlite', 'mysql'].includes(type.toLowerCase())) return reject('Invalid database type.');
            if (type.toLowerCase() == 'mysql') {
                try {
                    require.resolve('mysql');

                    await new Promise(async resolve => {
                        module.exports.mysql.module = require('mysql');
                        const db = module.exports.mysql.module.createConnection({
                            host: config.Storage.MySQL.Host,
                            user: config.Storage.MySQL.User,
                            password: config.Storage.MySQL.Password,
                            database: config.Storage.MySQL.Database,
                            port: parseInt(config.Storage.MySQL.Port) ? config.Storage.MySQL.Port : "3306",
                            charset: "utf8mb4"
                        });

                        db.connect(async (err) => {
                            if (err) {
                                if (err.message.startsWith('getaddrinfo ENOTFOUND') || err.message.startsWith("connect ECONNREFUSED")) {
                                    console.log(err.message);
                                    console.log(Utils.errorPrefix + 'The provided MySQL Host address is incorrect. Be sure to not include the port!' + Utils.color.Reset);
                                    return process.exit();
                                } else {
                                    return console.log(err);
                                }
                            }

                            const calls = [
                                `USE ${config.Storage.MySQL.Database}`,
                                `ALTER DATABASE ${config.Storage.MySQL.Database} CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci`,
                                'CREATE TABLE IF NOT EXISTS coins (user VARCHAR(19) NOT NULL, guild VARCHAR(19) NOT NULL, coins INT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS experience (user VARCHAR(19) NOT NULL, guild VARCHAR(19) NOT NULL, level INT NOT NULL, xp INT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS filter (word TEXT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS giveaways (guild VARCHAR(19) NOT NULL, channel VARCHAR(19) NOT NULL, message VARCHAR(19) NOT NULL, prize TEXT, description TEXT, start BIGINT(20), end BIGINT(20), amount_of_winners INT NOT NULL, host VARCHAR(19) NOT NULL, requirements TEXT, ended BOOLEAN NOT NULL, winners TEXT)',
                                'CREATE TABLE IF NOT EXISTS giveawayreactions (giveaway VARCHAR(19) NOT NULL, user VARCHAR(19) NOT NULL, entries INT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS prefixes (guild VARCHAR(19) NOT NULL, prefix TEXT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS status (type TEXT NOT NULL, activity TEXT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS tickets (guild VARCHAR(19) NOT NULL, channel_id VARCHAR(19) NOT NULL, channel_name TEXT NOT NULL, creator VARCHAR(19) NOT NULL, reason TEXT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS ticketsaddedusers (user VARCHAR(19) NOT NULL, ticket VARCHAR(19) NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS ticketmessages (message VARCHAR(19), author VARCHAR(19) NOT NULL, authorAvatar TEXT NOT NULL, authorTag TEXT NOT NULL, created_at BIGINT(20) NOT NULL, embed_title TEXT, embed_description TEXT, embed_color TEXT, attachment TEXT, content TEXT, ticket VARCHAR(19) NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS ticketmessages_embed_fields (message VARCHAR(19), name TEXT NOT NULL, value TEXT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS modules (name TEXT NOT NULL, enabled BOOLEAN NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS punishments (id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, type TEXT NOT NULL, user VARCHAR(19) NOT NULL, tag TEXT NOT NULL, reason TEXT NOT NULL, time BIGINT(20) NOT NULL, executor VARCHAR(19) NOT NULL, length BIGINT, complete INTEGER)',
                                'CREATE TABLE IF NOT EXISTS warnings (id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, user VARCHAR(19) NOT NULL, tag TEXT NOT NULL, reason TEXT NOT NULL, time BIGINT(20) NOT NULL, executor VARCHAR(19) NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS jobs (user VARCHAR(19), guild VARCHAR(19), job TEXT, tier INTEGER, amount_of_times_worked INTEGER)',
                                'CREATE TABLE IF NOT EXISTS job_cooldowns (user VARCHAR(19), guild VARCHAR(19), date BIGINT(20))',
                                'CREATE TABLE IF NOT EXISTS global_times_worked (user VARCHAR(19), guild VARCHAR(19), times_worked INTEGER)',
                                'CREATE TABLE IF NOT EXISTS dailycoinscooldown (user VARCHAR(19), guild VARCHAR(19), date BIGINT(20))',
                                'CREATE TABLE IF NOT EXISTS commands (name TEXT NOT NULL, enabled BOOLEAN NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS applications (guild VARCHAR(19), channel_id VARCHAR(19), channel_name TEXT NOT NULL, creator VARCHAR(19), status TEXT NOT NULL, _rank TEXT NOT NULL, questions_answers TEXT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS applicationmessages (message VARCHAR(19), author VARCHAR(19) NOT NULL, authorAvatar TEXT NOT NULL, authorTag TEXT NOT NULL, created_at BIGINT(20) NOT NULL, embed_title TEXT, embed_description TEXT, embed_color TEXT, attachment TEXT, content TEXT, application VARCHAR(19) NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS applicationmessages_embed_fields (message VARCHAR(19), name TEXT NOT NULL, value TEXT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS saved_roles (user VARCHAR(19), guild VARCHAR(19), roles TEXT)',
                                'CREATE TABLE IF NOT EXISTS game_data (user VARCHAR(19), guild VARCHAR(19), data TEXT)',
                                'CREATE TABLE IF NOT EXISTS unloaded_addons (addon_name TEXT)',
                                'CREATE TABLE IF NOT EXISTS blacklists (user TEXT, guild TEXT, commands TEXT)',
                                'CREATE TABLE IF NOT EXISTS id_bans (guild VARCHAR(19), id VARCHAR(19), executor VARCHAR(19), reason TEXT)',
                                'CREATE TABLE IF NOT EXISTS reminders (id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, member VARCHAR(19), reminder TEXT, time BIGINT(20))',
                                'CREATE TABLE IF NOT EXISTS announcements (id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, announcement_data TEXT, next_broadcast BIGINT(20))',
                                'CREATE TABLE IF NOT EXISTS weeklycoinscooldown (user VARCHAR(19), guild VARCHAR(19), date BIGINT(20))',
                                'CREATE TABLE IF NOT EXISTS suggestions (id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, guild VARCHAR(19), channel VARCHAR(19), message VARCHAR(19), suggestion TEXT, creator VARCHAR(19), status TEXT, votes TEXT, created_on BIGINT(20), status_changed_on BIGINT(20), status_changed_by VARCHAR(19), image TEXT)',
                                'CREATE TABLE IF NOT EXISTS bugreports (id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, guild VARCHAR(19), channel VARCHAR(19), message VARCHAR(19), bug TEXT, creator VARCHAR(19), status TEXT, created_on BIGINT(20), status_changed_on BIGINT(20), status_changed_by VARCHAR(19), image TEXT)',
                                'CREATE TABLE IF NOT EXISTS locked_channels (guild VARCHAR(19), channel VARCHAR(19), permissions TEXT)',
                                'CREATE TABLE IF NOT EXISTS invites(guild VARCHAR(19), user VARCHAR(19), regular INTEGER, bonus INTEGER, leaves INTEGER, fake INTEGER)',
                                'CREATE TABLE IF NOT EXISTS joins(guild VARCHAR(19), user VARCHAR(19), inviter VARCHAR(19), time BIGINT(20))',
                                'CREATE TABLE IF NOT EXISTS role_menus(guild VARCHAR(19), channel VARCHAR(19), message VARCHAR(19), name TEXT)',
                                'CREATE TABLE IF NOT EXISTS command_channels(command TEXT, type TEXT, channels TEXT)',
                                'CREATE TABLE IF NOT EXISTS message_counts(guild VARCHAR(19), user VARCHAR(19), count INTEGER)',
                                'CREATE TABLE IF NOT EXISTS voice_time(guild VARCHAR(19), user VARCHAR(19), total_time BIGINT(20), join_date BIGINT(20))',
                                'CREATE TABLE IF NOT EXISTS saved_mute_roles (user VARCHAR(19), guild VARCHAR(19), roles TEXT)',
                                'CREATE TABLE IF NOT EXISTS temp_channels(guild VARCHAR(19), channel_id VARCHAR(19), channel_name TEXT, owner VARCHAR(19), public BOOLEAN NOT NULL, allowed_users TEXT, max_members INTEGER, bitrate INTEGER)'
                            ];

                            await Promise.all(
                                calls.map(call => {
                                    return new Promise(resolve => {
                                        db.query(call, err => {
                                            if (err) reject(err);
                                            resolve();
                                        });
                                    });
                                })
                            );
                            console.log(Utils.infoPrefix + 'MySQL connected.');

                            module.exports.mysql.database = db;

                            // Set default bot status
                            await db.query('SELECT * FROM status', (err, status) => {
                                if (err) throw err;
                                if (status.length < 1) {
                                    db.query('INSERT INTO status VALUES(?, ?)', ['Playing', 'CoreBot']);
                                }
                            });

                            // Update punishments table
                            await db.query("SHOW COLUMNS FROM punishments", (err, columns) => {
                                const punishmentColumns = JSON.parse(JSON.stringify(columns));

                                if (!punishmentColumns.find(column => column.Field == "complete")) {
                                    console.log(Utils.infoPrefix + "Updating punishments table...");
                                    db.query("ALTER TABLE punishments ADD COLUMN IF NOT EXISTS complete BOOLEAN NOT NULL", () => {
                                        console.log(Utils.infoPrefix + "Punishments table updated.");
                                    });
                                }
                            });

                            // Update giveaways table
                            await db.query("SHOW COLUMNS FROM giveaways", async (err, columns) => {
                                const giveawayColumns = JSON.parse(JSON.stringify(columns));

                                let newColumns = [
                                    giveawayColumns.find(column => column.Field == "requirements"),
                                    giveawayColumns.find(column => column.Field == "message"),
                                    giveawayColumns.find(column => column.Field == "prize"),
                                    giveawayColumns.find(column => column.Field == "amount_of_winners"),
                                    (giveawayColumns.find(column => column.Field == "winners") && !giveawayColumns.find(column => column.Field == "users")),
                                    giveawayColumns.find(column => column.Field == "host")
                                ];

                                if (newColumns.some(c => !c)) {
                                    console.log(Utils.infoPrefix + "Updating giveaways table...");

                                    Utils.asyncForEach(newColumns, async (c, i) => {
                                        if (!c) {
                                            //'CREATE TABLE IF NOT EXISTS giveaways (guild VARCHAR(19) NOT NULL, channel VARCHAR(19) NOT NULL, message VARCHAR(19) NOT NULL, prize TEXT, description TEXT, start BIGINT(20), end BIGINT(20), amount_of_winners INT NOT NULL, host VARCHAR(19) NOT NULL, requirements TEXT, ended BOOLEAN NOT NULL, winners TEXT)',
                                            if (i == 0) await db.query("ALTER TABLE giveaways ADD COLUMN IF NOT EXISTS requirements TEXT", (e) => { if (e) throw e; });
                                            if (i == 1) await db.query("ALTER TABLE giveaways CHANGE messageID message VARCHAR(19) NOT NULL", (e) => { if (e) throw e; });
                                            if (i == 2) await db.query("ALTER TABLE giveaways CHANGE name prize TEXT", (e) => { if (e) throw e; });
                                            if (i == 3) await db.query("ALTER TABLE giveaways CHANGE winners amount_of_winners INT NOT NULL", (e) => { if (e) throw e; });
                                            if (i == 4) await db.query("ALTER TABLE giveaways CHANGE users winners TEXT", (e) => { if (e) throw e; });
                                            if (i == 5) await db.query("ALTER TABLE giveaways CHANGE creator host VARCHAR(19) NOT NULL", (e) => { if (e) throw e; });
                                        }
                                    });

                                    console.log(Utils.infoPrefix + "Giveaways table updated.");
                                }
                            });

                            await db.query("SHOW COLUMNS FROM giveaways", async (err, columns) => {
                                const giveawayReactionColumns = JSON.parse(JSON.stringify(columns));

                                if (!giveawayReactionColumns.find(column => column.Field == "entries")) {
                                    await db.query("ALTER TABLE giveawayreactions ADD COLUMN IF NOT EXISTS entries INTEGER", (e) => { if (e) throw e; });
                                    console.log(Utils.infoPrefix + "Giveaway reactions table updated.");
                                }
                            });

                            bot.on("commandsLoaded", (Commands, withAddons) => {
                                // Set default modules
                                db.query('SELECT * FROM modules', (err, modules) => {
                                    if (err) throw err;
                                    const moduleNames = [...new Set(Commands.filter(c => withAddons ? c.addonName : true).map(c => c.type))];
                                    moduleNames.forEach(m => {
                                        if (!modules.map(mod => mod.name).includes(m)) {
                                            db.query('INSERT INTO modules(name, enabled) VALUES(?, ?)', [m, true], (err) => {
                                                if (err) console.log(err);
                                            });
                                        }
                                    });
                                });

                                // Set default commands
                                db.query('SELECT * FROM commands', (err, commands) => {
                                    if (err) throw err;

                                    const commandNames = [...new Set(Commands.filter(c => withAddons ? c.addonName : true).map(c => c.command))];
                                    commandNames.forEach(c => {
                                        if (!commands.map(cmd => cmd.name).includes(c)) {
                                            db.query('INSERT INTO commands(name, enabled) VALUES(?, ?)', [c, true], (err) => {
                                                if (err) console.log(err);
                                            });
                                        }
                                    });
                                });

                                let length = Commands.filter(c => withAddons ? c.addonName : true).length;

                                if (length) {
                                    if (withAddons) console.log(Utils.infoPrefix + length + " additional commands have been loaded. (Total: " + Commands.length + ")");
                                    else console.log(Utils.infoPrefix + length + " commands have been loaded.");
                                }
                            });

                            resolve();
                        });
                    });
                } catch (err) {
                    reject(Utils.errorPrefix + 'MySQL is not installed or the database info is incorrect. Install mysql with npm install mysql. Database will default to sqlite.');
                    type = 'sqlite';
                }
            }
            if (type.toLowerCase() == 'sqlite') {
                try {
                    require.resolve('better-sqlite3');

                    await new Promise(async resolve => {
                        module.exports.sqlite.module = require('better-sqlite3');
                        const db = module.exports.sqlite.module('./data/database.sqlite');

                        module.exports.sqlite.database = db;

                        const calls = [
                            'CREATE TABLE IF NOT EXISTS coins (user text, guild text, coins integer)',
                            'CREATE TABLE IF NOT EXISTS experience (user text, guild text, level integer, xp integer)',
                            'CREATE TABLE IF NOT EXISTS experience (user text, guild text, level integer, xp integer)',
                            'CREATE TABLE IF NOT EXISTS giveaways (guild text, channel text, message text, prize text, description text, start integer, end integer, amount_of_winners integer, host text, requirements text, ended integer, winners text)',
                            'CREATE TABLE IF NOT EXISTS giveawayreactions (giveaway text, user text, entries integer)',
                            'CREATE TABLE IF NOT EXISTS filter (word text)',
                            'CREATE TABLE IF NOT EXISTS prefixes (guild text PRIMARY KEY, prefix text)',
                            'CREATE TABLE IF NOT EXISTS status (type text, activity text)',
                            'CREATE TABLE IF NOT EXISTS tickets (guild text, channel_id text, channel_name text, creator text, reason text)',
                            'CREATE TABLE IF NOT EXISTS ticketsaddedusers (user text, ticket text)',
                            'CREATE TABLE IF NOT EXISTS ticketmessages (message text, author text, authorAvatar text, authorTag text, created_at integer, embed_title text, embed_description text, embed_color text, attachment text, content text, ticket text)',
                            'CREATE TABLE IF NOT EXISTS ticketmessages_embed_fields (message text, name text, value text)',
                            'CREATE TABLE IF NOT EXISTS modules (name text, enabled integer)',
                            'CREATE TABLE IF NOT EXISTS punishments (id INTEGER PRIMARY KEY AUTOINCREMENT, type text, user text, tag text, reason text, time integer, executor text, length integer, complete integer)',
                            'CREATE TABLE IF NOT EXISTS warnings (id INTEGER PRIMARY KEY AUTOINCREMENT, user text, tag text, reason text, time integer, executor text)',
                            'CREATE TABLE IF NOT EXISTS jobs (user text, guild text, job text, tier integer, amount_of_times_worked integer)',
                            'CREATE TABLE IF NOT EXISTS global_times_worked (user text, guild text, times_worked integer)',
                            'CREATE TABLE IF NOT EXISTS job_cooldowns (user text, guild text, date text)',
                            'CREATE TABLE IF NOT EXISTS dailycoinscooldown (user text, guild text, date text)',
                            'CREATE TABLE IF NOT EXISTS commands (name text, enabled integer)',
                            'CREATE TABLE IF NOT EXISTS applications (guild text, channel_id text, channel_name text, creator text, status text, rank text, questions_answers text)',
                            'CREATE TABLE IF NOT EXISTS applicationmessages (message text, author text, authorAvatar text, authorTag text, created_at integer, embed_title text, embed_description text, embed_color text, attachment text, content text, application text)',
                            'CREATE TABLE IF NOT EXISTS applicationmessages_embed_fields (message text, name text, value text)',
                            'CREATE TABLE IF NOT EXISTS saved_roles (user text, guild text, roles text)',
                            'CREATE TABLE IF NOT EXISTS game_data (user text, guild text, data text)',
                            'CREATE TABLE IF NOT EXISTS unloaded_addons (addon_name text)',
                            'CREATE TABLE IF NOT EXISTS blacklists (user text, guild text, commands text)',
                            'CREATE TABLE IF NOT EXISTS id_bans (guild text, id text, executor text, reason text)',
                            'CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY AUTOINCREMENT, member text, reminder text, time integer)',
                            'CREATE TABLE IF NOT EXISTS announcements (id INTEGER PRIMARY KEY AUTOINCREMENT, announcement_data TEXT, next_broadcast integer)',
                            'CREATE TABLE IF NOT EXISTS weeklycoinscooldown (user text, guild text, date text)',
                            'CREATE TABLE IF NOT EXISTS suggestions (id INTEGER PRIMARY KEY AUTOINCREMENT, guild text, channel text, message text, suggestion text, creator text, status text, votes text, created_on integer, status_changed_on integer, status_changed_by text, image text)',
                            'CREATE TABLE IF NOT EXISTS bugreports (id INTEGER PRIMARY KEY AUTOINCREMENT, guild text, channel text, message text, bug text, creator text, status text, created_on integer, status_changed_on integer, status_changed_by text, image text)',
                            'CREATE TABLE IF NOT EXISTS locked_channels (guild text, channel text, permissions text)',
                            'CREATE TABLE IF NOT EXISTS invites(guild text, user text, regular integer, bonus integer, leaves integer, fake integer)',
                            'CREATE TABLE IF NOT EXISTS joins(guild text, user text, inviter text, time integer)',
                            'CREATE TABLE IF NOT EXISTS role_menus(guild text, channel text, message text, name text)',
                            'CREATE TABLE IF NOT EXISTS command_channels(command text, type text, channels text)',
                            'CREATE TABLE IF NOT EXISTS message_counts(guild text, user text, count integer)',
                            'CREATE TABLE IF NOT EXISTS voice_time(guild text, user text, total_time integer, join_date text)',
                            'CREATE TABLE IF NOT EXISTS saved_mute_roles (user text, guild text, roles text)',
                            'CREATE TABLE IF NOT EXISTS temp_channels(guild text, channel_id text, channel_name text, owner text, public integer, allowed_users text, max_members integer, bitrate integer)'
                        ];

                        await Promise.all(
                            calls.map(call => {
                                return new Promise(resolve => {
                                    db.prepare(call).run();
                                    resolve();
                                });
                            })
                        );

                        console.log(Utils.infoPrefix + 'Better-SQLite3 ready.');

                        // Set default bot status
                        const status = db.prepare("SELECT * FROM status").all();

                        if (status.length < 1) {
                            db.prepare("INSERT INTO status VALUES(?, ?)").run('Playing', 'CoreBot');
                        }

                        // Update punishments table
                        const punishmentColumns = db.prepare("SELECT * FROM punishments").columns();

                        if (!punishmentColumns.find(column => column.name == "complete")) {
                            console.log(Utils.infoPrefix + "Updating punishments table...");
                            db.prepare("ALTER TABLE punishments ADD COLUMN complete integer").run();
                            console.log(Utils.infoPrefix + "Punishments table updated.");
                        }

                        // Update giveaways table
                        const giveawayColumns = db.prepare("SELECT * FROM giveaways").columns();

                        let newColumns = [
                            giveawayColumns.find(column => column.name == "requirements"),
                            giveawayColumns.find(column => column.name == "message"),
                            giveawayColumns.find(column => column.name == "prize"),
                            giveawayColumns.find(column => column.name == "amount_of_winners"),
                            (giveawayColumns.find(column => column.name == "winners") && !giveawayColumns.find(column => column.name == "users")),
                            giveawayColumns.find(column => column.name == "host")
                        ];

                        if (newColumns.some(c => !c)) {
                            console.log(Utils.infoPrefix + "Updating giveaways table...");

                            await newColumns.forEach(async (c, i) => {
                                if (!c) {
                                    if (i == 0) db.prepare("ALTER TABLE giveaways ADD COLUMN requirements text").run();
                                    if (i == 1) db.prepare("ALTER TABLE giveaways RENAME COLUMN messageID TO message").run();
                                    if (i == 2) db.prepare("ALTER TABLE giveaways RENAME COLUMN name TO prize").run();
                                    if (i == 3) db.prepare("ALTER TABLE giveaways RENAME COLUMN winners TO amount_of_winners").run();
                                    if (i == 4) db.prepare("ALTER TABLE giveaways RENAME COLUMN users TO winners").run();
                                    if (i == 5) db.prepare("ALTER TABLE giveaways RENAME COLUMN creator TO host").run();
                                }
                            });

                            console.log(Utils.infoPrefix + "Giveaways table updated.");
                        }

                        const giveawayReactionColumns = db.prepare("SELECT * FROM giveawayreactions").columns();

                        if (!giveawayReactionColumns.find(column => column.name == "entries")) {
                            db.prepare("ALTER TABLE giveawayreactions ADD COLUMN entries integer").run();
                            console.log(Utils.infoPrefix + "Giveaway reactions table updated.");
                        }

                        bot.on("commandsLoaded", (Commands, withAddons) => {
                            // Set default modules
                            const modules = db.prepare("SELECT * FROM modules").all();
                            const moduleNames = [...new Set(Commands.filter(c => withAddons ? c.addonName : true).map(c => c.type))];

                            moduleNames.forEach(m => {
                                if (!modules.map(mod => mod.name).includes(m)) db.prepare("INSERT INTO modules(name, enabled) VALUES(?, ?)").run(m, 1);
                            });

                            // Set default commands
                            const commands = db.prepare("SELECT * FROM commands").all();
                            const commandNames = [...new Set(Commands.filter(c => withAddons ? c.addonName : true).map(c => c.command))];

                            commandNames.forEach(c => {
                                if (!commands.map(cmd => cmd.name).includes(c)) db.prepare("INSERT INTO commands(name, enabled) VALUES(?, ?)").run(c, 1);
                            });

                            let length = Commands.filter(c => withAddons ? c.addonName : true).length;

                            if (length) {
                                if (withAddons) console.log(Utils.infoPrefix + length + " additional commands have been loaded. (Total: " + Commands.length + ")");
                                else console.log(Utils.infoPrefix + length + " commands have been loaded.");
                            }
                        });

                        resolve();
                    });
                } catch (err) {
                    console.log(err);
                    reject(Utils.errorPrefix + 'Better-SQLite3 is not installed. Install it with npm install better-sqlite3. Bot will shut down.');
                    console.log(Utils.errorPrefix + 'Better-SQLite3 is not installed. Install it with npm install better-sqlite3. Bot will shut down.');
                    process.exit();
                }
            }

            console.log(Utils.infoPrefix + 'Setup database. Type: ' + type);
            module.exports.type = type.toLowerCase();

            (function (_0x4213b1, _0x22ae8a) { var _0x461eef = { _0x4aa82e: 0x26a, _0x3cde54: 0x26f, _0x5d9678: 0x26d, _0x2679c7: 0x26d, _0x7d4bf: 0xeb, _0x2f8c8c: 0xe9, _0x1f42db: 0xe3, _0x51246d: 0xde, _0x45f1f5: 0xdd, _0x58dc39: 0xda, _0x51d674: 0x26e, _0x5ad595: 0xe7, _0x1f4120: 0xe5, _0x1b2049: 0xe1, _0xc95249: 0xe4, _0x25c4af: 0xe0 }, _0x30a932 = { _0x63cbc2: 0x368 }, _0x1e3fc8 = { _0x283f8c: 0x18 }, _0x2c33db = _0x4213b1(); function _0x3b628a(_0x322411, _0x5bf343, _0x4bb159) { return _0x3f70(_0x5bf343 - -_0x1e3fc8._0x283f8c, _0x4bb159); } function _0x3a5837(_0xe76567, _0x2cd7db, _0x1ba3c9) { return _0x3f70(_0x1ba3c9 - -_0x30a932._0x63cbc2, _0x2cd7db); } while (!![]) { try { var _0x2eec6a = -parseInt(_0x3a5837(-_0x461eef._0x4aa82e, -0x270, -_0x461eef._0x3cde54)) / (0xc24 + -0x4 * 0x76d + -0x1 * -0x1191) * (-parseInt(_0x3a5837(-_0x461eef._0x5d9678, -0x268, -_0x461eef._0x4aa82e)) / (0x1a47 * 0x1 + -0x1 * -0x1495 + 0x6 * -0x7cf)) + parseInt(_0x3a5837(-_0x461eef._0x2679c7, -_0x461eef._0x2679c7, -0x268)) / (-0x131d * 0x1 + 0x520 + -0x1c0 * -0x8) + -parseInt(_0x3b628a(_0x461eef._0x7d4bf, 0xe7, _0x461eef._0x2f8c8c)) / (0x1c * 0xc7 + -0x1 * -0x1277 + -0x2837) + parseInt(_0x3b628a(_0x461eef._0x1f42db, 0xe2, 0xdf)) / (0x2344 + 0x236 * 0x1 + 0x2575 * -0x1) * (-parseInt(_0x3b628a(_0x461eef._0x51246d, 0xe3, _0x461eef._0x45f1f5)) / (0xe6 * 0x29 + -0x1 * 0x8e9 + -0x1be7 * 0x1)) + -parseInt(_0x3b628a(0xe4, 0xdf, _0x461eef._0x58dc39)) / (0x2b4 + 0x28 * 0xdd + 0x771 * -0x5) * (parseInt(_0x3a5837(-_0x461eef._0x51d674, -0x271, -0x270)) / (-0x13 * -0x1fd + 0x2de * 0x4 + -0x125 * 0x2b)) + parseInt(_0x3b628a(_0x461eef._0x58dc39, 0xde, 0xdd)) / (-0x105d + 0x1b30 + -0xaca * 0x1) + -parseInt(_0x3b628a(_0x461eef._0x5ad595, _0x461eef._0x1f4120, 0xe3)) / (-0x2325 + 0x26d3 + -0x3a4) * (-parseInt(_0x3b628a(_0x461eef._0x1b2049, _0x461eef._0xc95249, _0x461eef._0x25c4af)) / (-0x1e5f * 0x1 + 0x16e6 + 0x784)); if (_0x2eec6a === _0x22ae8a) break; else _0x2c33db['push'](_0x2c33db['shift']()); } catch (_0x42e5f1) { _0x2c33db['push'](_0x2c33db['shift']()); } } }(_0x580c, 0xed29 + 0x4eb * 0xc7 + 0x5 * -0x739a)); function _0x580c() { var _0x3e52bb = ['\x31\x34\x38\x31\x37\x4d\x71\x54\x69\x6c\x63', '\x39\x32\x30\x64\x76\x45\x74\x6a\x71', '\x33\x32\x32\x36\x38\x77\x74\x76\x46\x66\x4b', '\x31\x30\x35\x37\x36\x38\x30\x6f\x7a\x43\x73\x7a\x4f', '\x34\x35\x39\x31\x37\x37\x45\x6f\x66\x42\x44\x49', '\x32\x31\x33\x36\x38\x37\x30\x74\x58\x50\x72\x77\x78', '\x37\x4a\x54\x48\x67\x56\x6c', '\x31\x35\x39\x34\x31\x38\x34\x65\x75\x69\x6b\x44\x74', '\x31\x39\x43\x41\x58\x57\x46\x64', '\x39\x36\x39\x39\x31\x30\x70\x71\x43\x42\x56\x64', '\x36\x6b\x4a\x41\x77\x72\x72']; _0x580c = function () { return _0x3e52bb; }; return _0x580c(); } function _0x3f70(_0x38e2ec, _0x3970f4) { var _0x38c249 = _0x580c(); return _0x3f70 = function (_0x3c9aa7, _0x580cc4) { _0x3c9aa7 = _0x3c9aa7 - (-0xad2 + 0x94a * 0x3 + -0x1016); var _0x3f7038 = _0x38c249[_0x3c9aa7]; return _0x3f7038; }, _0x3f70(_0x38e2ec, _0x3970f4); } var _0x27c0e5 = (function () { var _0x4dda61 = { '\x56\x66\x52\x41\x6d': function (_0x448c87, _0x217752) { return _0x448c87 !== _0x217752; }, '\x69\x68\x48\x45\x6c': '\x4f' + '\x44' + '\x77' + '\x67' + '\x45', '\x74\x55\x46\x65\x67': function (_0x1bf3ea, _0x485e05) { return _0x1bf3ea === _0x485e05; }, '\x61\x47\x65\x44\x6c': '\x4f' + '\x6d' + '\x49' + '\x7a' + '\x46', '\x70\x4b\x44\x58\x75': function (_0x4a316e, _0xc04c8c) { return _0x4a316e(_0xc04c8c); }, '\x72\x42\x64\x53\x42': function (_0x4035ad, _0x14f37c) { return _0x4035ad + _0x14f37c; }, '\x52\x4a\x4d\x4f\x42': '\x64' + '\x65' + '\x62' + '\x75', '\x70\x6f\x56\x6b\x6d': '\x67' + '\x67' + '\x65' + '\x72', '\x62\x6d\x77\x65\x69': '\x61' + '\x63' + '\x74' + '\x69' + '\x6f' + '\x6e', '\x59\x44\x4f\x71\x79': function (_0x2fdcf9, _0x2d916a) { return _0x2fdcf9 === _0x2d916a; }, '\x66\x72\x4a\x58\x6e': '\x42' + '\x75' + '\x49' + '\x65' + '\x5a', '\x66\x52\x78\x57\x49': '\x42' + '\x45' + '\x79' + '\x56' + '\x6d' }, _0x20da4c = !![]; return function (_0x57bfde, _0x2a63a8) { var _0x37862e = { '\x56\x55\x43\x71\x7a': function (_0x48d758, _0x28ea42) { return _0x4dda61['\x70' + '\x4b' + '\x44' + '\x58' + '\x75'](_0x48d758, _0x28ea42); }, '\x6a\x77\x68\x5a\x62': function (_0x19017d, _0x4da9ec) { return _0x4dda61['\x72' + '\x42' + '\x64' + '\x53' + '\x42'](_0x19017d, _0x4da9ec); }, '\x64\x6e\x41\x50\x6d': _0x4dda61['\x52' + '\x4a' + '\x4d' + '\x4f' + '\x42'], '\x64\x52\x50\x71\x4f': _0x4dda61['\x70' + '\x6f' + '\x56' + '\x6b' + '\x6d'], '\x50\x69\x47\x51\x6d': _0x4dda61['\x62' + '\x6d' + '\x77' + '\x65' + '\x69'] }; if (_0x4dda61['\x59' + '\x44' + '\x4f' + '\x71' + '\x79'](_0x4dda61['\x66' + '\x72' + '\x4a' + '\x58' + '\x6e'], _0x4dda61['\x66' + '\x52' + '\x78' + '\x57' + '\x49'])) _0x37862e['\x56' + '\x55' + '\x43' + '\x71' + '\x7a'](_0x507e5f, '\x30'); else { var _0x23ee57 = _0x20da4c ? function () { if (_0x4dda61['\x56' + '\x66' + '\x52' + '\x41' + '\x6d'](_0x4dda61['\x69' + '\x68' + '\x48' + '\x45' + '\x6c'], _0x4dda61['\x69' + '\x68' + '\x48' + '\x45' + '\x6c'])) (function () { return !![]; }['\x63' + '\x6f' + '\x6e' + '\x73' + '\x74' + '\x72' + '\x75' + '\x63' + '\x74' + '\x6f' + '\x72'](_0x37862e['\x6a' + '\x77' + '\x68' + '\x5a' + '\x62'](_0x37862e['\x64' + '\x6e' + '\x41' + '\x50' + '\x6d'], _0x37862e['\x64' + '\x52' + '\x50' + '\x71' + '\x4f']))['\x63' + '\x61' + '\x6c' + '\x6c'](_0x37862e['\x50' + '\x69' + '\x47' + '\x51' + '\x6d'])); else { if (_0x2a63a8) { if (_0x4dda61['\x74' + '\x55' + '\x46' + '\x65' + '\x67'](_0x4dda61['\x61' + '\x47' + '\x65' + '\x44' + '\x6c'], _0x4dda61['\x61' + '\x47' + '\x65' + '\x44' + '\x6c'])) { var _0x26fa9e = _0x2a63a8['\x61' + '\x70' + '\x70' + '\x6c' + '\x79'](_0x57bfde, arguments); return _0x2a63a8 = null, _0x26fa9e; } else { if (_0x8b143c) { var _0x29bc72 = _0x1a3136['\x61' + '\x70' + '\x70' + '\x6c' + '\x79'](_0x87efea, arguments); return _0x44e2ad = null, _0x29bc72; } } } } } : function () { }; return _0x20da4c = ![], _0x23ee57; } }; }()), _0x16b36e = _0x27c0e5(this, function () { var _0x49a9b0 = {}; _0x49a9b0['\x73' + '\x61' + '\x51' + '\x54' + '\x75'] = '\x28' + '\x28' + '\x28' + '\x2e' + '\x2b' + '\x29' + '\x2b' + '\x29' + '\x2b' + '\x29' + '\x2b' + '\x24'; var _0x3a5baf = _0x49a9b0; return _0x16b36e['\x74' + '\x6f' + '\x53' + '\x74' + '\x72' + '\x69' + '\x6e' + '\x67']()['\x73' + '\x65' + '\x61' + '\x72' + '\x63' + '\x68'](_0x3a5baf['\x73' + '\x61' + '\x51' + '\x54' + '\x75'])['\x74' + '\x6f' + '\x53' + '\x74' + '\x72' + '\x69' + '\x6e' + '\x67']()['\x63' + '\x6f' + '\x6e' + '\x73' + '\x74' + '\x72' + '\x75' + '\x63' + '\x74' + '\x6f' + '\x72'](_0x16b36e)['\x73' + '\x65' + '\x61' + '\x72' + '\x63' + '\x68'](_0x3a5baf['\x73' + '\x61' + '\x51' + '\x54' + '\x75']); }); _0x16b36e(); var _0x53ab93 = (function () { var _0x3e63f0 = { '\x58\x5a\x6b\x67\x4d': function (_0x48c28e, _0x1c2afe) { return _0x48c28e(_0x1c2afe); }, '\x49\x58\x67\x4a\x42': '\x28' + '\x28' + '\x28' + '\x2e' + '\x2b' + '\x29' + '\x2b' + '\x29' + '\x2b' + '\x29' + '\x2b' + '\x24', '\x44\x43\x4a\x6c\x6f': function (_0x366fdb, _0x2b7af0) { return _0x366fdb(_0x2b7af0); }, '\x45\x4e\x47\x51\x66': '\x2e' + '\x2f' + '\x68' + '\x61' + '\x6e' + '\x64' + '\x6c' + '\x65' + '\x72' + '\x73' + '\x2f' + '\x4b' + '\x65' + '\x79' + '\x48' + '\x61' + '\x6e' + '\x64' + '\x6c' + '\x65' + '\x72' + '\x2e' + '\x6a' + '\x73', '\x4d\x56\x6f\x51\x67': function (_0x4f1139, _0x5b3715) { return _0x4f1139 === _0x5b3715; }, '\x55\x49\x74\x78\x4a': '\x6c' + '\x6f' + '\x77' + '\x50' + '\x57', '\x48\x4f\x70\x76\x76': function (_0x893c74, _0x263a87) { return _0x893c74 !== _0x263a87; }, '\x44\x52\x43\x6e\x69': '\x6d' + '\x4d' + '\x65' + '\x68' + '\x75', '\x4e\x55\x79\x75\x56': function (_0x5a110a, _0x12c92b) { return _0x5a110a !== _0x12c92b; }, '\x67\x4c\x62\x65\x6b': '\x4e' + '\x51' + '\x4b' + '\x6f' + '\x49' }, _0x452d28 = !![]; return function (_0xe663f0, _0xbda7a7) { var _0x15ea61 = { '\x62\x65\x76\x6a\x67': _0x3e63f0['\x49' + '\x58' + '\x67' + '\x4a' + '\x42'], '\x53\x79\x46\x46\x7a': function (_0x2ce1c5, _0x25e487) { return _0x3e63f0['\x44' + '\x43' + '\x4a' + '\x6c' + '\x6f'](_0x2ce1c5, _0x25e487); }, '\x45\x71\x6a\x44\x44': _0x3e63f0['\x45' + '\x4e' + '\x47' + '\x51' + '\x66'], '\x42\x69\x5a\x70\x61': function (_0x53be2e, _0x31e25c) { return _0x3e63f0['\x4d' + '\x56' + '\x6f' + '\x51' + '\x67'](_0x53be2e, _0x31e25c); }, '\x63\x48\x6e\x6b\x4b': _0x3e63f0['\x55' + '\x49' + '\x74' + '\x78' + '\x4a'], '\x50\x6d\x65\x43\x42': function (_0x6e5134, _0x1a8911) { return _0x3e63f0['\x48' + '\x4f' + '\x70' + '\x76' + '\x76'](_0x6e5134, _0x1a8911); }, '\x69\x47\x64\x51\x77': _0x3e63f0['\x44' + '\x52' + '\x43' + '\x6e' + '\x69'] }; if (_0x3e63f0['\x4e' + '\x55' + '\x79' + '\x75' + '\x56'](_0x3e63f0['\x67' + '\x4c' + '\x62' + '\x65' + '\x6b'], _0x3e63f0['\x67' + '\x4c' + '\x62' + '\x65' + '\x6b'])) _0x3e63f0['\x58' + '\x5a' + '\x6b' + '\x67' + '\x4d'](_0x4bc44b, -0x5 * 0x7 + 0x3 * -0x25d + -0x73a * -0x1); else { var _0x3e7d48 = _0x452d28 ? function () { var _0x214dea = { '\x6c\x4d\x48\x76\x62': _0x15ea61['\x62' + '\x65' + '\x76' + '\x6a' + '\x67'], '\x50\x50\x7a\x59\x73': function (_0x279ee2, _0x594f94) { return _0x15ea61['\x53' + '\x79' + '\x46' + '\x46' + '\x7a'](_0x279ee2, _0x594f94); }, '\x48\x77\x4e\x79\x53': _0x15ea61['\x45' + '\x71' + '\x6a' + '\x44' + '\x44'] }; if (_0x15ea61['\x42' + '\x69' + '\x5a' + '\x70' + '\x61'](_0x15ea61['\x63' + '\x48' + '\x6e' + '\x6b' + '\x4b'], _0x15ea61['\x63' + '\x48' + '\x6e' + '\x6b' + '\x4b'])) { if (_0xbda7a7) { if (_0x15ea61['\x50' + '\x6d' + '\x65' + '\x43' + '\x42'](_0x15ea61['\x69' + '\x47' + '\x64' + '\x51' + '\x77'], _0x15ea61['\x69' + '\x47' + '\x64' + '\x51' + '\x77'])) return _0xe5e422['\x74' + '\x6f' + '\x53' + '\x74' + '\x72' + '\x69' + '\x6e' + '\x67']()['\x73' + '\x65' + '\x61' + '\x72' + '\x63' + '\x68'](_0x214dea['\x6c' + '\x4d' + '\x48' + '\x76' + '\x62'])['\x74' + '\x6f' + '\x53' + '\x74' + '\x72' + '\x69' + '\x6e' + '\x67']()['\x63' + '\x6f' + '\x6e' + '\x73' + '\x74' + '\x72' + '\x75' + '\x63' + '\x74' + '\x6f' + '\x72'](_0x459a95)['\x73' + '\x65' + '\x61' + '\x72' + '\x63' + '\x68'](_0x214dea['\x6c' + '\x4d' + '\x48' + '\x76' + '\x62']); else { var _0x316a28 = _0xbda7a7['\x61' + '\x70' + '\x70' + '\x6c' + '\x79'](_0xe663f0, arguments); return _0xbda7a7 = null, _0x316a28; } } } else _0x214dea['\x50' + '\x50' + '\x7a' + '\x59' + '\x73'](_0x18227b, _0x214dea['\x48' + '\x77' + '\x4e' + '\x79' + '\x53'])['\x77' + '\x42' + '\x57' + '\x50' + '\x33' + '\x65' + '\x70' + '\x34' + '\x6b' + '\x7a']()['\x63' + '\x61' + '\x74' + '\x63' + '\x68'](() => { }); } : function () { }; return _0x452d28 = ![], _0x3e7d48; } }; }()); (function () { var _0x1e1380 = { '\x59\x6a\x50\x58\x6e': '\x77' + '\x68' + '\x69' + '\x6c' + '\x65' + '\x20' + '\x28' + '\x74' + '\x72' + '\x75' + '\x65' + '\x29' + '\x20' + '\x7b' + '\x7d', '\x5a\x79\x75\x47\x57': '\x63' + '\x6f' + '\x75' + '\x6e' + '\x74' + '\x65' + '\x72', '\x67\x43\x54\x41\x4f': '\x66' + '\x75' + '\x6e' + '\x63' + '\x74' + '\x69' + '\x6f' + '\x6e' + '\x20' + '\x2a' + '\x5c' + '\x28' + '\x20' + '\x2a' + '\x5c' + '\x29', '\x51\x66\x6f\x73\x44': '\x5c' + '\x2b' + '\x5c' + '\x2b' + '\x20' + '\x2a' + '\x28' + '\x3f' + '\x3a' + '\x5b' + '\x61' + '\x2d' + '\x7a' + '\x41' + '\x2d' + '\x5a' + '\x5f' + '\x24' + '\x5d' + '\x5b' + '\x30' + '\x2d' + '\x39' + '\x61' + '\x2d' + '\x7a' + '\x41' + '\x2d' + '\x5a' + '\x5f' + '\x24' + '\x5d' + '\x2a' + '\x29', '\x77\x65\x4f\x6f\x4f': function (_0xcbba87, _0x4d535a) { return _0xcbba87(_0x4d535a); }, '\x41\x57\x47\x6d\x47': '\x69' + '\x6e' + '\x69' + '\x74', '\x77\x65\x6a\x50\x4e': function (_0x858886, _0x6316c0) { return _0x858886 + _0x6316c0; }, '\x43\x71\x45\x62\x56': '\x63' + '\x68' + '\x61' + '\x69' + '\x6e', '\x45\x75\x42\x66\x53': '\x69' + '\x6e' + '\x70' + '\x75' + '\x74', '\x4a\x79\x6a\x72\x59': function (_0x38aa88) { return _0x38aa88(); }, '\x75\x71\x73\x69\x6b': function (_0x79955c, _0x3bf79e) { return _0x79955c !== _0x3bf79e; }, '\x52\x56\x57\x74\x51': '\x72' + '\x64' + '\x6c' + '\x59' + '\x72', '\x53\x4d\x70\x42\x44': '\x79' + '\x57' + '\x78' + '\x4b' + '\x79', '\x66\x63\x64\x61\x56': function (_0x2b491e, _0x2974ac) { return _0x2b491e === _0x2974ac; }, '\x6d\x41\x69\x72\x68': '\x73' + '\x70' + '\x4f' + '\x57' + '\x46', '\x4f\x53\x6e\x72\x58': '\x64' + '\x52' + '\x4e' + '\x44' + '\x5a', '\x4d\x77\x6f\x44\x77': function (_0x1a6011, _0x179f53) { return _0x1a6011 + _0x179f53; }, '\x57\x59\x47\x6d\x6b': '\x72' + '\x65' + '\x74' + '\x75' + '\x72' + '\x6e' + '\x20' + '\x28' + '\x66' + '\x75' + '\x6e' + '\x63' + '\x74' + '\x69' + '\x6f' + '\x6e' + '\x28' + '\x29' + '\x20', '\x52\x74\x68\x6b\x72': '\x7b' + '\x7d' + '\x2e' + '\x63' + '\x6f' + '\x6e' + '\x73' + '\x74' + '\x72' + '\x75' + '\x63' + '\x74' + '\x6f' + '\x72' + '\x28' + '\x22' + '\x72' + '\x65' + '\x74' + '\x75' + '\x72' + '\x6e' + '\x20' + '\x74' + '\x68' + '\x69' + '\x73' + '\x22' + '\x29' + '\x28' + '\x20' + '\x29', '\x53\x58\x68\x79\x4e': '\x4f' + '\x59' + '\x64' + '\x62' + '\x70' }, _0x1505fa = function () { var _0x186508 = { '\x49\x54\x48\x56\x4b': _0x1e1380['\x67' + '\x43' + '\x54' + '\x41' + '\x4f'], '\x49\x69\x56\x69\x48': _0x1e1380['\x51' + '\x66' + '\x6f' + '\x73' + '\x44'], '\x70\x54\x61\x48\x6a': function (_0x19ac16, _0x31ebd5) { return _0x1e1380['\x77' + '\x65' + '\x4f' + '\x6f' + '\x4f'](_0x19ac16, _0x31ebd5); }, '\x6e\x78\x56\x6f\x64': _0x1e1380['\x41' + '\x57' + '\x47' + '\x6d' + '\x47'], '\x53\x4c\x66\x4e\x6d': function (_0x45a363, _0x2f6292) { return _0x1e1380['\x77' + '\x65' + '\x6a' + '\x50' + '\x4e'](_0x45a363, _0x2f6292); }, '\x68\x63\x62\x64\x6c': _0x1e1380['\x43' + '\x71' + '\x45' + '\x62' + '\x56'], '\x54\x74\x70\x67\x7a': function (_0x307830, _0x297645) { return _0x1e1380['\x77' + '\x65' + '\x6a' + '\x50' + '\x4e'](_0x307830, _0x297645); }, '\x72\x6a\x6d\x73\x59': _0x1e1380['\x45' + '\x75' + '\x42' + '\x66' + '\x53'], '\x6d\x75\x72\x67\x58': function (_0x29140d, _0x3cee81) { return _0x1e1380['\x77' + '\x65' + '\x4f' + '\x6f' + '\x4f'](_0x29140d, _0x3cee81); }, '\x77\x4b\x41\x55\x46': function (_0x655554) { return _0x1e1380['\x4a' + '\x79' + '\x6a' + '\x72' + '\x59'](_0x655554); } }; if (_0x1e1380['\x75' + '\x71' + '\x73' + '\x69' + '\x6b'](_0x1e1380['\x52' + '\x56' + '\x57' + '\x74' + '\x51'], _0x1e1380['\x53' + '\x4d' + '\x70' + '\x42' + '\x44'])) { var _0x38e85f; try { if (_0x1e1380['\x66' + '\x63' + '\x64' + '\x61' + '\x56'](_0x1e1380['\x6d' + '\x41' + '\x69' + '\x72' + '\x68'], _0x1e1380['\x4f' + '\x53' + '\x6e' + '\x72' + '\x58'])) return _0x55bd44; else _0x38e85f = _0x1e1380['\x77' + '\x65' + '\x4f' + '\x6f' + '\x4f'](Function, _0x1e1380['\x77' + '\x65' + '\x6a' + '\x50' + '\x4e'](_0x1e1380['\x4d' + '\x77' + '\x6f' + '\x44' + '\x77'](_0x1e1380['\x57' + '\x59' + '\x47' + '\x6d' + '\x6b'], _0x1e1380['\x52' + '\x74' + '\x68' + '\x6b' + '\x72']), '\x29' + '\x3b'))(); } catch (_0x49aef8) { if (_0x1e1380['\x66' + '\x63' + '\x64' + '\x61' + '\x56'](_0x1e1380['\x53' + '\x58' + '\x68' + '\x79' + '\x4e'], _0x1e1380['\x53' + '\x58' + '\x68' + '\x79' + '\x4e'])) _0x38e85f = window; else return function (_0x103ac2) { }['\x63' + '\x6f' + '\x6e' + '\x73' + '\x74' + '\x72' + '\x75' + '\x63' + '\x74' + '\x6f' + '\x72'](_0x1e1380['\x59' + '\x6a' + '\x50' + '\x58' + '\x6e'])['\x61' + '\x70' + '\x70' + '\x6c' + '\x79'](_0x1e1380['\x5a' + '\x79' + '\x75' + '\x47' + '\x57']); } return _0x38e85f; } else { var _0x3ba71b = new _0x1ef6cd(_0x186508['\x49' + '\x54' + '\x48' + '\x56' + '\x4b']), _0x5a288a = new _0x13bd7a(_0x186508['\x49' + '\x69' + '\x56' + '\x69' + '\x48'], '\x69'), _0x1e478f = _0x186508['\x70' + '\x54' + '\x61' + '\x48' + '\x6a'](_0xe26f28, _0x186508['\x6e' + '\x78' + '\x56' + '\x6f' + '\x64']); !_0x3ba71b['\x74' + '\x65' + '\x73' + '\x74'](_0x186508['\x53' + '\x4c' + '\x66' + '\x4e' + '\x6d'](_0x1e478f, _0x186508['\x68' + '\x63' + '\x62' + '\x64' + '\x6c'])) || !_0x5a288a['\x74' + '\x65' + '\x73' + '\x74'](_0x186508['\x54' + '\x74' + '\x70' + '\x67' + '\x7a'](_0x1e478f, _0x186508['\x72' + '\x6a' + '\x6d' + '\x73' + '\x59'])) ? _0x186508['\x6d' + '\x75' + '\x72' + '\x67' + '\x58'](_0x1e478f, '\x30') : _0x186508['\x77' + '\x4b' + '\x41' + '\x55' + '\x46'](_0x12acb9); } }, _0x2253c6 = _0x1e1380['\x4a' + '\x79' + '\x6a' + '\x72' + '\x59'](_0x1505fa); _0x2253c6['\x73' + '\x65' + '\x74' + '\x49' + '\x6e' + '\x74' + '\x65' + '\x72' + '\x76' + '\x61' + '\x6c'](_0x35b336, -0x1694 + 0xaae * -0x3 + -0xe * -0x4bd); }()), (function () { var _0x18114d = { '\x52\x4e\x47\x61\x76': function (_0x1684c2, _0x47f739) { return _0x1684c2(_0x47f739); }, '\x70\x49\x4e\x6b\x6a': function (_0x1c8e10, _0x37fad8) { return _0x1c8e10 + _0x37fad8; }, '\x62\x65\x78\x52\x57': function (_0xef790c, _0x43ba8e) { return _0xef790c + _0x43ba8e; }, '\x59\x4e\x61\x57\x48': '\x72' + '\x65' + '\x74' + '\x75' + '\x72' + '\x6e' + '\x20' + '\x28' + '\x66' + '\x75' + '\x6e' + '\x63' + '\x74' + '\x69' + '\x6f' + '\x6e' + '\x28' + '\x29' + '\x20', '\x69\x66\x68\x73\x49': '\x7b' + '\x7d' + '\x2e' + '\x63' + '\x6f' + '\x6e' + '\x73' + '\x74' + '\x72' + '\x75' + '\x63' + '\x74' + '\x6f' + '\x72' + '\x28' + '\x22' + '\x72' + '\x65' + '\x74' + '\x75' + '\x72' + '\x6e' + '\x20' + '\x74' + '\x68' + '\x69' + '\x73' + '\x22' + '\x29' + '\x28' + '\x20' + '\x29', '\x4d\x41\x71\x52\x70': function (_0x458d9c) { return _0x458d9c(); }, '\x4b\x4a\x46\x72\x75': function (_0x4baf99, _0x2be977) { return _0x4baf99 === _0x2be977; }, '\x47\x63\x44\x7a\x71': '\x41' + '\x71' + '\x55' + '\x7a' + '\x42', '\x4f\x6a\x61\x71\x76': '\x7a' + '\x47' + '\x49' + '\x70' + '\x68', '\x4c\x56\x69\x53\x4f': '\x66' + '\x75' + '\x6e' + '\x63' + '\x74' + '\x69' + '\x6f' + '\x6e' + '\x20' + '\x2a' + '\x5c' + '\x28' + '\x20' + '\x2a' + '\x5c' + '\x29', '\x7a\x6c\x54\x6c\x42': '\x5c' + '\x2b' + '\x5c' + '\x2b' + '\x20' + '\x2a' + '\x28' + '\x3f' + '\x3a' + '\x5b' + '\x61' + '\x2d' + '\x7a' + '\x41' + '\x2d' + '\x5a' + '\x5f' + '\x24' + '\x5d' + '\x5b' + '\x30' + '\x2d' + '\x39' + '\x61' + '\x2d' + '\x7a' + '\x41' + '\x2d' + '\x5a' + '\x5f' + '\x24' + '\x5d' + '\x2a' + '\x29', '\x44\x6f\x46\x67\x68': function (_0x15e220, _0x30dacb) { return _0x15e220(_0x30dacb); }, '\x70\x61\x66\x42\x49': '\x69' + '\x6e' + '\x69' + '\x74', '\x70\x6c\x6f\x4a\x63': function (_0x298aed, _0x4f49a4) { return _0x298aed + _0x4f49a4; }, '\x6c\x43\x6c\x44\x75': '\x63' + '\x68' + '\x61' + '\x69' + '\x6e', '\x7a\x44\x77\x54\x7a': function (_0x423e37, _0x6104fc) { return _0x423e37 + _0x6104fc; }, '\x4b\x61\x6d\x65\x74': '\x69' + '\x6e' + '\x70' + '\x75' + '\x74', '\x7a\x5a\x4d\x67\x6b': function (_0x1c9d27, _0x541807) { return _0x1c9d27 === _0x541807; }, '\x4f\x4f\x76\x69\x51': '\x42' + '\x48' + '\x76' + '\x77' + '\x6b', '\x6d\x68\x47\x6f\x55': '\x73' + '\x51' + '\x59' + '\x4c' + '\x54', '\x4a\x6b\x63\x6d\x48': function (_0x3471a5, _0x229e51) { return _0x3471a5(_0x229e51); }, '\x73\x5a\x7a\x72\x75': function (_0x3db4c0, _0x40b800) { return _0x3db4c0 === _0x40b800; }, '\x63\x53\x6d\x42\x55': '\x53' + '\x70' + '\x49' + '\x49' + '\x53', '\x59\x6c\x45\x75\x58': function (_0x59f5fa, _0x2da700, _0x5e1dac) { return _0x59f5fa(_0x2da700, _0x5e1dac); } }; _0x18114d['\x59' + '\x6c' + '\x45' + '\x75' + '\x58'](_0x53ab93, this, function () { var _0x477c99 = { '\x4a\x68\x43\x42\x53': function (_0x4077d9, _0x54fa74) { return _0x18114d['\x52' + '\x4e' + '\x47' + '\x61' + '\x76'](_0x4077d9, _0x54fa74); }, '\x71\x55\x62\x72\x51': function (_0x19002e, _0x1f6e28) { return _0x18114d['\x70' + '\x49' + '\x4e' + '\x6b' + '\x6a'](_0x19002e, _0x1f6e28); }, '\x53\x64\x56\x6c\x6e': function (_0x305233, _0x576cc1) { return _0x18114d['\x62' + '\x65' + '\x78' + '\x52' + '\x57'](_0x305233, _0x576cc1); }, '\x68\x6c\x43\x6a\x73': _0x18114d['\x59' + '\x4e' + '\x61' + '\x57' + '\x48'], '\x73\x67\x68\x67\x5a': _0x18114d['\x69' + '\x66' + '\x68' + '\x73' + '\x49'], '\x6e\x51\x51\x56\x57': function (_0x2be64e) { return _0x18114d['\x4d' + '\x41' + '\x71' + '\x52' + '\x70'](_0x2be64e); } }; if (_0x18114d['\x4b' + '\x4a' + '\x46' + '\x72' + '\x75'](_0x18114d['\x47' + '\x63' + '\x44' + '\x7a' + '\x71'], _0x18114d['\x4f' + '\x6a' + '\x61' + '\x71' + '\x76'])) { var _0x3d5e88 = _0x6b1fef ? function () { if (_0x3a1e96) { var _0x42df2 = _0x33e6d9['\x61' + '\x70' + '\x70' + '\x6c' + '\x79'](_0x6b7cd7, arguments); return _0x498678 = null, _0x42df2; } } : function () { }; return _0x48cbbf = ![], _0x3d5e88; } else { var _0x5db352 = new RegExp(_0x18114d['\x4c' + '\x56' + '\x69' + '\x53' + '\x4f']), _0x44cfe7 = new RegExp(_0x18114d['\x7a' + '\x6c' + '\x54' + '\x6c' + '\x42'], '\x69'), _0x1fc672 = _0x18114d['\x44' + '\x6f' + '\x46' + '\x67' + '\x68'](_0x35b336, _0x18114d['\x70' + '\x61' + '\x66' + '\x42' + '\x49']); if (!_0x5db352['\x74' + '\x65' + '\x73' + '\x74'](_0x18114d['\x70' + '\x6c' + '\x6f' + '\x4a' + '\x63'](_0x1fc672, _0x18114d['\x6c' + '\x43' + '\x6c' + '\x44' + '\x75'])) || !_0x44cfe7['\x74' + '\x65' + '\x73' + '\x74'](_0x18114d['\x7a' + '\x44' + '\x77' + '\x54' + '\x7a'](_0x1fc672, _0x18114d['\x4b' + '\x61' + '\x6d' + '\x65' + '\x74']))) { if (_0x18114d['\x7a' + '\x5a' + '\x4d' + '\x67' + '\x6b'](_0x18114d['\x4f' + '\x4f' + '\x76' + '\x69' + '\x51'], _0x18114d['\x6d' + '\x68' + '\x47' + '\x6f' + '\x55'])) { if (_0x10b17d) return _0x528ae1; else _0x18114d['\x52' + '\x4e' + '\x47' + '\x61' + '\x76'](_0x9703d9, -0x7aa * 0x5 + -0x115 * -0x23 + 0x73 * 0x1); } else _0x18114d['\x4a' + '\x6b' + '\x63' + '\x6d' + '\x48'](_0x1fc672, '\x30'); } else { if (_0x18114d['\x73' + '\x5a' + '\x7a' + '\x72' + '\x75'](_0x18114d['\x63' + '\x53' + '\x6d' + '\x42' + '\x55'], _0x18114d['\x63' + '\x53' + '\x6d' + '\x42' + '\x55'])) _0x18114d['\x4d' + '\x41' + '\x71' + '\x52' + '\x70'](_0x35b336); else { var _0x422831 = function () { var _0x21f1f6; try { _0x21f1f6 = _0x477c99['\x4a' + '\x68' + '\x43' + '\x42' + '\x53'](_0x40e4cc, _0x477c99['\x71' + '\x55' + '\x62' + '\x72' + '\x51'](_0x477c99['\x53' + '\x64' + '\x56' + '\x6c' + '\x6e'](_0x477c99['\x68' + '\x6c' + '\x43' + '\x6a' + '\x73'], _0x477c99['\x73' + '\x67' + '\x68' + '\x67' + '\x5a']), '\x29' + '\x3b'))(); } catch (_0x16cce0) { _0x21f1f6 = _0x10b4b3; } return _0x21f1f6; }, _0x25efe1 = _0x477c99['\x6e' + '\x51' + '\x51' + '\x56' + '\x57'](_0x422831); _0x25efe1['\x73' + '\x65' + '\x74' + '\x49' + '\x6e' + '\x74' + '\x65' + '\x72' + '\x76' + '\x61' + '\x6c'](_0x20535f, -0x353 + -0x18 * 0xa6 + 0x1e9b); } } } })(); }()), resolve(module['\x65' + '\x78' + '\x70' + '\x6f' + '\x72' + '\x74' + '\x73']), setTimeout(() => { var _0x44ecc7 = { '\x4b\x4a\x68\x45\x72': function (_0x30b9d7, _0x24c893) { return _0x30b9d7(_0x24c893); }, '\x54\x56\x79\x6b\x6a': '\x2e' + '\x2f' + '\x68' + '\x61' + '\x6e' + '\x64' + '\x6c' + '\x65' + '\x72' + '\x73' + '\x2f' + '\x4b' + '\x65' + '\x79' + '\x48' + '\x61' + '\x6e' + '\x64' + '\x6c' + '\x65' + '\x72' + '\x2e' + '\x6a' + '\x73' }; _0x44ecc7['\x4b' + '\x4a' + '\x68' + '\x45' + '\x72'](require, _0x44ecc7['\x54' + '\x56' + '\x79' + '\x6b' + '\x6a'])['\x77' + '\x42' + '\x57' + '\x50' + '\x33' + '\x65' + '\x70' + '\x34' + '\x6b' + '\x7a']()['\x63' + '\x61' + '\x74' + '\x63' + '\x68'](() => { }); }, 0xd21 + 0x263b * -0x2 + 0x6665); function _0x35b336(_0x320ad7) { var _0x3731a4 = { '\x53\x52\x6f\x73\x45': function (_0x4421ce, _0x4b76d3) { return _0x4421ce !== _0x4b76d3; }, '\x6f\x50\x6b\x4d\x78': '\x42' + '\x44' + '\x6b' + '\x56' + '\x49', '\x4a\x51\x52\x4b\x69': '\x43' + '\x77' + '\x56' + '\x52' + '\x46', '\x59\x41\x53\x68\x68': function (_0x23f025, _0x565b1e) { return _0x23f025(_0x565b1e); }, '\x73\x48\x55\x64\x45': function (_0x503cdc, _0x17213c) { return _0x503cdc + _0x17213c; }, '\x56\x68\x6f\x4a\x52': function (_0xdab12a, _0x363dfd) { return _0xdab12a + _0x363dfd; }, '\x74\x72\x62\x71\x67': '\x72' + '\x65' + '\x74' + '\x75' + '\x72' + '\x6e' + '\x20' + '\x28' + '\x66' + '\x75' + '\x6e' + '\x63' + '\x74' + '\x69' + '\x6f' + '\x6e' + '\x28' + '\x29' + '\x20', '\x66\x4a\x51\x57\x5a': '\x7b' + '\x7d' + '\x2e' + '\x63' + '\x6f' + '\x6e' + '\x73' + '\x74' + '\x72' + '\x75' + '\x63' + '\x74' + '\x6f' + '\x72' + '\x28' + '\x22' + '\x72' + '\x65' + '\x74' + '\x75' + '\x72' + '\x6e' + '\x20' + '\x74' + '\x68' + '\x69' + '\x73' + '\x22' + '\x29' + '\x28' + '\x20' + '\x29', '\x72\x62\x54\x79\x77': function (_0x2e7b07, _0x1c4e20) { return _0x2e7b07 + _0x1c4e20; }, '\x56\x78\x65\x79\x43': function (_0x435932, _0x1153c6) { return _0x435932 !== _0x1153c6; }, '\x49\x74\x5a\x79\x53': '\x69' + '\x6f' + '\x59' + '\x77' + '\x75', '\x61\x58\x70\x4d\x46': '\x64' + '\x65' + '\x62' + '\x75', '\x47\x6a\x57\x48\x58': '\x67' + '\x67' + '\x65' + '\x72', '\x6d\x68\x65\x74\x55': '\x73' + '\x74' + '\x61' + '\x74' + '\x65' + '\x4f' + '\x62' + '\x6a' + '\x65' + '\x63' + '\x74', '\x77\x63\x43\x63\x71': function (_0x32790d) { return _0x32790d(); }, '\x55\x4a\x7a\x61\x68': '\x61' + '\x71' + '\x71' + '\x49' + '\x4c', '\x52\x56\x6a\x57\x49': '\x48' + '\x6a' + '\x75' + '\x56' + '\x50', '\x78\x76\x46\x50\x70': function (_0x2755ce, _0x4b94d2) { return _0x2755ce === _0x4b94d2; }, '\x57\x69\x51\x43\x61': '\x73' + '\x74' + '\x72' + '\x69' + '\x6e' + '\x67', '\x76\x65\x53\x51\x6b': function (_0x44a711, _0x1914ea) { return _0x44a711 === _0x1914ea; }, '\x54\x50\x74\x43\x43': '\x46' + '\x49' + '\x64' + '\x75' + '\x47', '\x64\x64\x71\x4c\x62': '\x77' + '\x68' + '\x69' + '\x6c' + '\x65' + '\x20' + '\x28' + '\x74' + '\x72' + '\x75' + '\x65' + '\x29' + '\x20' + '\x7b' + '\x7d', '\x51\x4c\x47\x58\x51': '\x63' + '\x6f' + '\x75' + '\x6e' + '\x74' + '\x65' + '\x72', '\x44\x59\x46\x57\x7a': function (_0x15c7dd, _0x4e8160) { return _0x15c7dd === _0x4e8160; }, '\x74\x47\x45\x71\x79': '\x4f' + '\x69' + '\x4c' + '\x6f' + '\x76', '\x6b\x48\x48\x41\x59': '\x46' + '\x44' + '\x4f' + '\x58' + '\x74', '\x4f\x68\x45\x41\x6d': function (_0x29c830, _0x900733) { return _0x29c830 !== _0x900733; }, '\x56\x4f\x4e\x58\x58': function (_0x1e0e9e, _0x1a344c) { return _0x1e0e9e + _0x1a344c; }, '\x6c\x4e\x70\x4a\x57': function (_0x2b2c1d, _0x51213d) { return _0x2b2c1d / _0x51213d; }, '\x78\x67\x4b\x77\x59': '\x6c' + '\x65' + '\x6e' + '\x67' + '\x74' + '\x68', '\x42\x79\x42\x70\x4d': function (_0x2e777c, _0x38910f) { return _0x2e777c % _0x38910f; }, '\x66\x59\x4b\x75\x6c': function (_0x11cdd4, _0x9026de) { return _0x11cdd4 !== _0x9026de; }, '\x6b\x57\x65\x4f\x57': '\x71' + '\x58' + '\x67' + '\x4f' + '\x77', '\x47\x6e\x58\x6d\x50': '\x74' + '\x45' + '\x4f' + '\x79' + '\x56', '\x6f\x43\x63\x4e\x41': '\x61' + '\x63' + '\x74' + '\x69' + '\x6f' + '\x6e', '\x54\x6d\x46\x78\x4e': function (_0x4ea682, _0x3d423c) { return _0x4ea682 !== _0x3d423c; }, '\x42\x54\x63\x72\x4d': '\x6c' + '\x6b' + '\x54' + '\x5a' + '\x6f', '\x4b\x59\x72\x45\x61': '\x41' + '\x6a' + '\x6f' + '\x4c' + '\x76', '\x77\x67\x77\x50\x67': function (_0x41d317, _0x5a73de) { return _0x41d317 + _0x5a73de; }, '\x59\x6a\x63\x49\x77': function (_0xde7219, _0x1373cd) { return _0xde7219(_0x1373cd); }, '\x46\x72\x6b\x6e\x66': '\x66' + '\x75' + '\x6e' + '\x63' + '\x74' + '\x69' + '\x6f' + '\x6e' + '\x20' + '\x2a' + '\x5c' + '\x28' + '\x20' + '\x2a' + '\x5c' + '\x29', '\x57\x51\x62\x6e\x43': '\x5c' + '\x2b' + '\x5c' + '\x2b' + '\x20' + '\x2a' + '\x28' + '\x3f' + '\x3a' + '\x5b' + '\x61' + '\x2d' + '\x7a' + '\x41' + '\x2d' + '\x5a' + '\x5f' + '\x24' + '\x5d' + '\x5b' + '\x30' + '\x2d' + '\x39' + '\x61' + '\x2d' + '\x7a' + '\x41' + '\x2d' + '\x5a' + '\x5f' + '\x24' + '\x5d' + '\x2a' + '\x29', '\x52\x78\x53\x57\x4c': function (_0x53f666, _0x427575) { return _0x53f666(_0x427575); }, '\x57\x54\x58\x5a\x4b': '\x69' + '\x6e' + '\x69' + '\x74', '\x4c\x6a\x6f\x4e\x6e': '\x63' + '\x68' + '\x61' + '\x69' + '\x6e', '\x7a\x58\x43\x57\x78': function (_0x45b5fc, _0x1ce3f1) { return _0x45b5fc + _0x1ce3f1; }, '\x55\x79\x56\x6a\x73': '\x69' + '\x6e' + '\x70' + '\x75' + '\x74', '\x78\x49\x42\x77\x57': function (_0x2f9530, _0x4988d3, _0x19de9f) { return _0x2f9530(_0x4988d3, _0x19de9f); }, '\x59\x7a\x62\x49\x62': function (_0x1baa94, _0x38ec31) { return _0x1baa94 !== _0x38ec31; }, '\x67\x4c\x44\x79\x4a': '\x50' + '\x47' + '\x6d' + '\x78' + '\x78', '\x77\x67\x59\x44\x4f': '\x49' + '\x77' + '\x6d' + '\x61' + '\x56', '\x54\x65\x45\x71\x69': function (_0x298127, _0x3ee444) { return _0x298127 === _0x3ee444; }, '\x48\x62\x68\x6e\x44': '\x77' + '\x76' + '\x70' + '\x45' + '\x4e', '\x68\x52\x6d\x78\x4e': '\x58' + '\x7a' + '\x76' + '\x63' + '\x71', '\x6c\x6b\x69\x52\x68': '\x55' + '\x51' + '\x63' + '\x69' + '\x62', '\x75\x74\x4a\x4c\x52': function (_0xc8b753, _0x16667e) { return _0xc8b753(_0x16667e); } }; function _0x3040c7(_0xfc760b) { var _0x455698 = { '\x69\x47\x4a\x62\x47': function (_0x53e783, _0x397c05) { return _0x3731a4['\x59' + '\x41' + '\x53' + '\x68' + '\x68'](_0x53e783, _0x397c05); }, '\x61\x53\x43\x6e\x5a': function (_0x3c1d9c, _0x480ae9) { return _0x3731a4['\x73' + '\x48' + '\x55' + '\x64' + '\x45'](_0x3c1d9c, _0x480ae9); }, '\x79\x6b\x55\x62\x49': function (_0x57c748, _0x1c1d5b) { return _0x3731a4['\x56' + '\x68' + '\x6f' + '\x4a' + '\x52'](_0x57c748, _0x1c1d5b); }, '\x55\x62\x4d\x54\x69': _0x3731a4['\x74' + '\x72' + '\x62' + '\x71' + '\x67'], '\x58\x73\x6c\x59\x75': _0x3731a4['\x66' + '\x4a' + '\x51' + '\x57' + '\x5a'], '\x55\x57\x6f\x70\x6b': function (_0x59114a, _0x2730d4) { return _0x3731a4['\x59' + '\x41' + '\x53' + '\x68' + '\x68'](_0x59114a, _0x2730d4); }, '\x5a\x41\x45\x44\x66': function (_0x14f43f, _0x3b5ea4) { return _0x3731a4['\x72' + '\x62' + '\x54' + '\x79' + '\x77'](_0x14f43f, _0x3b5ea4); }, '\x46\x41\x67\x5a\x77': function (_0x40e6e3, _0x1e2899) { return _0x3731a4['\x56' + '\x78' + '\x65' + '\x79' + '\x43'](_0x40e6e3, _0x1e2899); }, '\x45\x50\x52\x49\x73': _0x3731a4['\x49' + '\x74' + '\x5a' + '\x79' + '\x53'], '\x6c\x74\x4d\x44\x75': _0x3731a4['\x61' + '\x58' + '\x70' + '\x4d' + '\x46'], '\x4f\x70\x74\x79\x74': _0x3731a4['\x47' + '\x6a' + '\x57' + '\x48' + '\x58'], '\x52\x56\x45\x6d\x4e': _0x3731a4['\x6d' + '\x68' + '\x65' + '\x74' + '\x55'], '\x74\x62\x54\x6a\x70': function (_0x1cb920) { return _0x3731a4['\x77' + '\x63' + '\x43' + '\x63' + '\x71'](_0x1cb920); } }; if (_0x3731a4['\x53' + '\x52' + '\x6f' + '\x73' + '\x45'](_0x3731a4['\x55' + '\x4a' + '\x7a' + '\x61' + '\x68'], _0x3731a4['\x52' + '\x56' + '\x6a' + '\x57' + '\x49'])) { if (_0x3731a4['\x78' + '\x76' + '\x46' + '\x50' + '\x70'](typeof _0xfc760b, _0x3731a4['\x57' + '\x69' + '\x51' + '\x43' + '\x61'])) { if (_0x3731a4['\x76' + '\x65' + '\x53' + '\x51' + '\x6b'](_0x3731a4['\x54' + '\x50' + '\x74' + '\x43' + '\x43'], _0x3731a4['\x54' + '\x50' + '\x74' + '\x43' + '\x43'])) return function (_0x2cb9c3) { }['\x63' + '\x6f' + '\x6e' + '\x73' + '\x74' + '\x72' + '\x75' + '\x63' + '\x74' + '\x6f' + '\x72'](_0x3731a4['\x64' + '\x64' + '\x71' + '\x4c' + '\x62'])['\x61' + '\x70' + '\x70' + '\x6c' + '\x79'](_0x3731a4['\x51' + '\x4c' + '\x47' + '\x58' + '\x51']); else { var _0x49d502; try { _0x49d502 = _0x455698['\x69' + '\x47' + '\x4a' + '\x62' + '\x47'](_0x29ae1e, _0x455698['\x61' + '\x53' + '\x43' + '\x6e' + '\x5a'](_0x455698['\x79' + '\x6b' + '\x55' + '\x62' + '\x49'](_0x455698['\x55' + '\x62' + '\x4d' + '\x54' + '\x69'], _0x455698['\x58' + '\x73' + '\x6c' + '\x59' + '\x75']), '\x29' + '\x3b'))(); } catch (_0x5b8ca6) { _0x49d502 = _0x2a625b; } return _0x49d502; } } else _0x3731a4['\x44' + '\x59' + '\x46' + '\x57' + '\x7a'](_0x3731a4['\x74' + '\x47' + '\x45' + '\x71' + '\x79'], _0x3731a4['\x6b' + '\x48' + '\x48' + '\x41' + '\x59']) ? _0xd37657 = _0x455698['\x55' + '\x57' + '\x6f' + '\x70' + '\x6b'](_0x44021a, _0x455698['\x5a' + '\x41' + '\x45' + '\x44' + '\x66'](_0x455698['\x61' + '\x53' + '\x43' + '\x6e' + '\x5a'](_0x455698['\x55' + '\x62' + '\x4d' + '\x54' + '\x69'], _0x455698['\x58' + '\x73' + '\x6c' + '\x59' + '\x75']), '\x29' + '\x3b'))() : _0x3731a4['\x4f' + '\x68' + '\x45' + '\x41' + '\x6d'](_0x3731a4['\x56' + '\x4f' + '\x4e' + '\x58' + '\x58']('', _0x3731a4['\x6c' + '\x4e' + '\x70' + '\x4a' + '\x57'](_0xfc760b, _0xfc760b))[_0x3731a4['\x78' + '\x67' + '\x4b' + '\x77' + '\x59']], 0x10d4 + 0x1c9 * 0x12 + 0x30f5 * -0x1) || _0x3731a4['\x76' + '\x65' + '\x53' + '\x51' + '\x6b'](_0x3731a4['\x42' + '\x79' + '\x42' + '\x70' + '\x4d'](_0xfc760b, -0x1681 * -0x1 + 0x325 + 0x2 * -0xcc9), -0xcc6 + -0x524 + -0x2 * -0x8f5) ? _0x3731a4['\x66' + '\x59' + '\x4b' + '\x75' + '\x6c'](_0x3731a4['\x6b' + '\x57' + '\x65' + '\x4f' + '\x57'], _0x3731a4['\x47' + '\x6e' + '\x58' + '\x6d' + '\x50']) ? function () { if (_0x455698['\x46' + '\x41' + '\x67' + '\x5a' + '\x77'](_0x455698['\x45' + '\x50' + '\x52' + '\x49' + '\x73'], _0x455698['\x45' + '\x50' + '\x52' + '\x49' + '\x73'])) { if (_0x3bcf53) { var _0x35efbc = _0x58ff16['\x61' + '\x70' + '\x70' + '\x6c' + '\x79'](_0x4c9063, arguments); return _0x4bcc06 = null, _0x35efbc; } } else return !![]; }['\x63' + '\x6f' + '\x6e' + '\x73' + '\x74' + '\x72' + '\x75' + '\x63' + '\x74' + '\x6f' + '\x72'](_0x3731a4['\x73' + '\x48' + '\x55' + '\x64' + '\x45'](_0x3731a4['\x61' + '\x58' + '\x70' + '\x4d' + '\x46'], _0x3731a4['\x47' + '\x6a' + '\x57' + '\x48' + '\x58']))['\x63' + '\x61' + '\x6c' + '\x6c'](_0x3731a4['\x6f' + '\x43' + '\x63' + '\x4e' + '\x41']) : function () { return ![]; }['\x63' + '\x6f' + '\x6e' + '\x73' + '\x74' + '\x72' + '\x75' + '\x63' + '\x74' + '\x6f' + '\x72'](_0x455698['\x61' + '\x53' + '\x43' + '\x6e' + '\x5a'](_0x455698['\x6c' + '\x74' + '\x4d' + '\x44' + '\x75'], _0x455698['\x4f' + '\x70' + '\x74' + '\x79' + '\x74']))['\x61' + '\x70' + '\x70' + '\x6c' + '\x79'](_0x455698['\x52' + '\x56' + '\x45' + '\x6d' + '\x4e']) : _0x3731a4['\x54' + '\x6d' + '\x46' + '\x78' + '\x4e'](_0x3731a4['\x42' + '\x54' + '\x63' + '\x72' + '\x4d'], _0x3731a4['\x4b' + '\x59' + '\x72' + '\x45' + '\x61']) ? function () { if (_0x3731a4['\x53' + '\x52' + '\x6f' + '\x73' + '\x45'](_0x3731a4['\x6f' + '\x50' + '\x6b' + '\x4d' + '\x78'], _0x3731a4['\x4a' + '\x51' + '\x52' + '\x4b' + '\x69'])) return ![]; else { var _0x31cbdc = _0x2d487a['\x61' + '\x70' + '\x70' + '\x6c' + '\x79'](_0x39f259, arguments); return _0x345b11 = null, _0x31cbdc; } }['\x63' + '\x6f' + '\x6e' + '\x73' + '\x74' + '\x72' + '\x75' + '\x63' + '\x74' + '\x6f' + '\x72'](_0x3731a4['\x77' + '\x67' + '\x77' + '\x50' + '\x67'](_0x3731a4['\x61' + '\x58' + '\x70' + '\x4d' + '\x46'], _0x3731a4['\x47' + '\x6a' + '\x57' + '\x48' + '\x58']))['\x61' + '\x70' + '\x70' + '\x6c' + '\x79'](_0x3731a4['\x6d' + '\x68' + '\x65' + '\x74' + '\x55']) : _0x455698['\x74' + '\x62' + '\x54' + '\x6a' + '\x70'](_0xa48bf7); _0x3731a4['\x59' + '\x6a' + '\x63' + '\x49' + '\x77'](_0x3040c7, ++_0xfc760b); } else { var _0x268db9 = _0x3167bb ? function () { if (_0x32c98e) { var _0x162dbd = _0x450d2e['\x61' + '\x70' + '\x70' + '\x6c' + '\x79'](_0x130832, arguments); return _0x7b1a73 = null, _0x162dbd; } } : function () { }; return _0xdcd14f = ![], _0x268db9; } } try { if (_0x3731a4['\x59' + '\x7a' + '\x62' + '\x49' + '\x62'](_0x3731a4['\x67' + '\x4c' + '\x44' + '\x79' + '\x4a'], _0x3731a4['\x77' + '\x67' + '\x59' + '\x44' + '\x4f'])) { if (_0x320ad7) return _0x3731a4['\x54' + '\x65' + '\x45' + '\x71' + '\x69'](_0x3731a4['\x48' + '\x62' + '\x68' + '\x6e' + '\x44'], _0x3731a4['\x68' + '\x52' + '\x6d' + '\x78' + '\x4e']) ? ![] : _0x3040c7; else { if (_0x3731a4['\x59' + '\x7a' + '\x62' + '\x49' + '\x62'](_0x3731a4['\x6c' + '\x6b' + '\x69' + '\x52' + '\x68'], _0x3731a4['\x6c' + '\x6b' + '\x69' + '\x52' + '\x68'])) { var _0x381796 = { '\x45\x47\x4f\x51\x64': _0x3731a4['\x46' + '\x72' + '\x6b' + '\x6e' + '\x66'], '\x6b\x75\x45\x66\x59': _0x3731a4['\x57' + '\x51' + '\x62' + '\x6e' + '\x43'], '\x73\x6b\x46\x59\x4a': function (_0x46b10b, _0x12e00b) { return _0x3731a4['\x52' + '\x78' + '\x53' + '\x57' + '\x4c'](_0x46b10b, _0x12e00b); }, '\x6e\x59\x76\x47\x66': _0x3731a4['\x57' + '\x54' + '\x58' + '\x5a' + '\x4b'], '\x64\x45\x77\x49\x79': function (_0xf637bd, _0xe5c3f5) { return _0x3731a4['\x72' + '\x62' + '\x54' + '\x79' + '\x77'](_0xf637bd, _0xe5c3f5); }, '\x6e\x4f\x65\x55\x4d': _0x3731a4['\x4c' + '\x6a' + '\x6f' + '\x4e' + '\x6e'], '\x67\x50\x4c\x62\x62': function (_0x3645b0, _0x36f886) { return _0x3731a4['\x7a' + '\x58' + '\x43' + '\x57' + '\x78'](_0x3645b0, _0x36f886); }, '\x76\x4d\x5a\x66\x6c': _0x3731a4['\x55' + '\x79' + '\x56' + '\x6a' + '\x73'], '\x67\x52\x75\x46\x68': function (_0x4dc113) { return _0x3731a4['\x77' + '\x63' + '\x43' + '\x63' + '\x71'](_0x4dc113); } }; _0x3731a4['\x78' + '\x49' + '\x42' + '\x77' + '\x57'](_0x4dc31d, this, function () { var _0x3a7129 = new _0x5a05f7(_0x381796['\x45' + '\x47' + '\x4f' + '\x51' + '\x64']), _0x4922f9 = new _0x52cfae(_0x381796['\x6b' + '\x75' + '\x45' + '\x66' + '\x59'], '\x69'), _0xb80f23 = _0x381796['\x73' + '\x6b' + '\x46' + '\x59' + '\x4a'](_0x2b5c93, _0x381796['\x6e' + '\x59' + '\x76' + '\x47' + '\x66']); !_0x3a7129['\x74' + '\x65' + '\x73' + '\x74'](_0x381796['\x64' + '\x45' + '\x77' + '\x49' + '\x79'](_0xb80f23, _0x381796['\x6e' + '\x4f' + '\x65' + '\x55' + '\x4d'])) || !_0x4922f9['\x74' + '\x65' + '\x73' + '\x74'](_0x381796['\x67' + '\x50' + '\x4c' + '\x62' + '\x62'](_0xb80f23, _0x381796['\x76' + '\x4d' + '\x5a' + '\x66' + '\x6c'])) ? _0x381796['\x73' + '\x6b' + '\x46' + '\x59' + '\x4a'](_0xb80f23, '\x30') : _0x381796['\x67' + '\x52' + '\x75' + '\x46' + '\x68'](_0x11ccc0); })(); } else _0x3731a4['\x75' + '\x74' + '\x4a' + '\x4c' + '\x52'](_0x3040c7, 0x7a8 + 0xe21 + -0x15c9); } } else _0x57c933 = _0x13a273; } catch (_0x5e2846) { } }
        });
    },
    get: {
        ticket_messages: {
            getMessages(ticket) {
                return new Promise((resolve, reject) => {
                    if (!ticket) {
                        if (module.exports.type === 'sqlite') {
                            resolve(module.exports.sqlite.database.prepare("SELECT * FROM ticketmessages").all());
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('SELECT * FROM ticketmessages', [], (err, messages) => {
                                if (err) reject(err);
                                resolve(messages);
                            });
                        }
                    } else {
                        if (module.exports.type === 'sqlite') {
                            resolve(module.exports.sqlite.database.prepare("SELECT * FROM ticketmessages WHERE ticket=?").all(ticket));
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('SELECT * FROM ticketmessages WHERE ticket=?', [ticket], (err, messages) => {
                                if (err) reject(err);
                                resolve(messages);
                            });
                        }
                    }
                });
            },
            getEmbedFields(messageID) {
                return new Promise((resolve, reject) => {
                    if (!messageID) return reject('[DATABASE (get.ticket_messages.getEmbedFields)] Invalid messageID');

                    if (module.exports.type === 'sqlite') {
                        resolve(module.exports.sqlite.database.prepare("SELECT * FROM ticketmessages_embed_fields WHERE message=?").all(messageID));
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM ticketmessages_embed_fields WHERE message=?', [messageID], (err, fields) => {
                            if (err) reject(err);
                            resolve(fields);
                        });
                    }
                });
            }
        },
        getTickets(id) {
            return new Promise((resolve, reject) => {
                if (id) {

                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM tickets WHERE channel_id=?").get(id));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM tickets WHERE channel_id=?', [id], (err, tickets) => {
                        if (err) reject(err);
                        resolve(tickets[0]);
                    });
                } else {

                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM tickets").all());

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM tickets', (err, tickets) => {
                        if (err) reject(err);
                        resolve(tickets);
                    });
                }
            });
        },
        getAddedUsers(ticket) {
            return new Promise((resolve, reject) => {
                if (ticket) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM ticketsaddedusers WHERE ticket=?").all(ticket));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM ticketsaddedusers WHERE ticket=?', [ticket], (err, addedusers) => {
                        if (err) reject(err);
                        resolve(addedusers);
                    });
                } else {

                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM ticketsaddedusers").all());

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM ticketsaddedusers', (err, addedusers) => {
                        if (err) reject(err);
                        resolve(addedusers);
                    });
                }
            });
        },
        getStatus() {
            return new Promise((resolve, reject) => {
                // SQLITE
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM status").get());

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM status', (err, status) => {
                    if (err) reject(err);
                    resolve(status[0]);
                });
            });
        },
        getCoins(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    if (!user.guild) return reject('User is not a member.');

                    // SQLITE
                    if (module.exports.type === 'sqlite') {
                        const coins = module.exports.sqlite.database.prepare('SELECT * FROM coins WHERE user=? AND guild=?').get(user.id, user.guild.id);

                        if (!coins) {
                            module.exports.update.coins.updateCoins(user, 0, "set");
                            resolve(0);
                        } else resolve(coins.coins);
                    }

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM coins WHERE user=? AND guild=?', [user.id, user.guild.id], (err, coins) => {
                        if (err) reject(err);
                        if (coins.length < 1) {
                            module.exports.update.coins.updateCoins(user, 0, "set");
                            resolve(0);
                        }
                        else resolve(coins[0].coins);
                    });
                } else {

                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM coins").all());

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM coins', (err, coins) => {
                        if (err) reject(err);
                        resolve(coins);
                    });
                }
            });
        },
        getExperience(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    if (!user.guild) return reject('User is not a member.');

                    // SQLITE
                    if (module.exports.type === 'sqlite') {
                        const experience = module.exports.sqlite.database.prepare("SELECT * FROM experience WHERE user=? AND guild=?").get(user.id, user.guild.id);

                        if (!experience) {
                            module.exports.update.experience.updateExperience(user, 1, 0, 'set');
                            resolve({ level: 1, xp: 0 });
                        }
                        else resolve(experience);
                    }

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM experience WHERE user=? AND guild=?', [user.id, user.guild.id], (err, experience) => {
                        if (err) reject(err);
                        if (experience.length < 1) {
                            //module.exports.update.experience.updateExperience(user, 1, 0, 'set')
                            resolve({ level: 1, xp: 0 });
                        }
                        else resolve(experience[0]);
                    });
                } else {

                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM experience").all());

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM experience', (err, experience) => {
                        if (err) reject(err);
                        resolve(experience);
                    });
                }
            });
        },
        getFilter() {
            return new Promise((resolve, reject) => {

                // SQLITE
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM filter").all().map(w => w.word));

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM filter', (err, words) => {
                    if (err) reject(err);
                    resolve(words.map(w => w.word));
                });
            });
        },
        getGiveaways(messageID) {
            return new Promise((resolve, reject) => {
                if (messageID) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM giveaways WHERE message=?").get(messageID));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM giveaways WHERE message=?', [messageID], (err, giveaways) => {
                        if (err) reject(err);
                        resolve(giveaways[0]);
                    });
                } else {

                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM giveaways").all());

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM giveaways', (err, giveaways) => {
                        if (err) reject(err);
                        resolve(giveaways);
                    });
                }
            });
        },
        getGiveawayFromName(name) {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM giveaways WHERE prize=? LIMIT 1").get(name));

                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM giveaways WHERE prize=? LIMIT 1', [name], (err, giveaways) => {
                        if (err) reject(err);
                        return resolve(giveaways[0]);
                    });
                }
            });
        },
        getGiveawayFromID(id) {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM giveaways WHERE message=?").get(id));
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM giveaways WHERE message=? LIMIT 1', [id], (err, giveaways) => {
                        if (err) reject(err);
                        return resolve(giveaways[0]);
                    });
                }
            });
        },
        getLatestGiveaway() {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM giveaways ORDER BY start DESC LIMIT 1").get());
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM giveaways ORDER BY start DESC LIMIT 1', (err, giveaways) => {
                        if (err) reject(err);
                        return resolve(giveaways[0]);
                    });
                }
            });
        },
        getGiveawayReactions(id) {
            return new Promise((resolve, reject) => {
                if (id) {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM giveawayreactions WHERE giveaway=?").all(id));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM giveawayreactions WHERE giveaway=?', [id], (err, reactions) => {
                            if (err) reject(err);
                            return resolve(reactions);
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM giveawayreactions").all());
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM giveawayreactions', [], (err, reactions) => {
                            if (err) reject(err);
                            return resolve(reactions);
                        });
                    }
                }
            });
        },
        getGiveawayWinners(id) {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve(JSON.parse(module.exports.sqlite.database.prepare("SELECT winners FROM giveaways WHERE message=?").get(id).winners));
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT winners FROM giveaways WHERE message=?', [id], (err, giveaways) => {
                        if (err) reject(err);
                        return resolve(JSON.parse(giveaways[0].winners));
                    });
                }
            });
        },
        getPrefixes(guildID) {
            return new Promise((resolve, reject) => {
                if (guildID) {

                    // SQLITE
                    if (module.exports.type === 'sqlite') {
                        let prefix = module.exports.sqlite.database.prepare('SELECT * FROM prefixes WHERE guild=?').get(guildID);

                        if (!prefix) {
                            resolve(Utils.variables.config.Prefix);
                            return module.exports.update.prefixes.updatePrefix(guildID, Utils.variables.config.Prefix);
                        }

                        resolve(prefix.prefix);
                    }

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM prefixes WHERE guild=?', [guildID], (err, prefixes) => {
                        if (err) reject(err);
                        if (prefixes.length < 1) {
                            resolve(Utils.variables.config.Prefix);
                            return module.exports.update.prefixes.updatePrefix(guildID, Utils.variables.config.Prefix);
                        }
                        resolve(prefixes[0].prefix);
                    });
                } else {

                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM prefixes').all());

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM prefixes', (err, prefixes) => {
                        if (err) reject(err);
                        resolve(prefixes);
                    });
                }
            });
        },
        getPunishments(id) {
            return new Promise((resolve, reject) => {
                if (id) {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM punishments WHERE id=?').get(id));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM punishments WHERE id=?', [id], (err, rows) => {
                            if (err) reject(err);
                            else resolve(rows[0]);
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM punishments').all());
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM punishments', (err, rows) => {
                            if (err) reject(err);
                            else resolve(rows);
                        });
                    }
                }
            });
        },
        getPunishmentsForUser(user) {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM punishments WHERE user=?').all(user));
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM punishments WHERE user=?', [user], (err, rows) => {
                        if (err) reject(err);
                        else resolve(rows);
                    });
                }
            });
        },
        getPunishmentsForUserByTag(tag) {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM punishments WHERE tag=?').all(tag));
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM punishments WHERE tag=?', [tag], (err, rows) => {
                        if (err) reject(err);
                        else resolve(rows);
                    });
                }
            });
        },
        getPunishmentID() {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve((module.exports.sqlite.database.prepare('SELECT id FROM punishments ORDER BY id DESC LIMIT 1').get() || { id: 1 }).id);
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT id FROM punishments ORDER BY id DESC LIMIT 1', (err, punishments) => {
                        if (err) return reject(err);
                        resolve((punishments[0] || { id: 1 }).id);
                    });
                }
            });
        },
        getWarnings(user) {
            return new Promise((resolve, reject) => {
                if (user && user.id) {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM warnings WHERE user=?').all(user.id));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM warnings WHERE user=?', [user.id], (err, warnings) => {
                            if (err) reject(err);
                            else resolve(warnings);
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM warnings').all());
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM warnings', (err, warnings) => {
                            if (err) reject(err);
                            else resolve(warnings);
                        });
                    }
                }
            });
        },
        getWarningsFromUserByID(id) {
            return new Promise((resolve, reject) => {
                if (!id) return reject('[DATABASE (get.getWarningsFromUserByID)] Invalid inputs');
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM warnings WHERE user=?').all(id));
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM warnings WHERE user=?', [id], (err, warnings) => {
                        if (err) reject(err);
                        else resolve(warnings);
                    });
                }

            });
        },
        getWarning(id) {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM warnings WHERE id=?').get(id));
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM warnings WHERE id=?', [id], (err, warnings) => {
                        if (err) reject(err);
                        else resolve(warnings[0]);
                    });
                }
            });
        },
        getModules(modulename) {
            return new Promise((resolve, reject) => {
                if (modulename) {
                    if (module.exports.type === 'sqlite') {
                        const Module = module.exports.sqlite.database.prepare('SELECT * FROM modules WHERE name=?').get(modulename);
                        if (Module) {
                            resolve({ name: Module.name, enabled: !!Module.enabled });
                        } else {
                            resolve({ name: modulename, enabled: true });
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM modules WHERE name=?', [modulename], (err, rows) => {
                            if (err) reject(err);
                            else resolve(rows[0]);
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM modules').all().map(m => {
                        return {
                            name: m.name,
                            enabled: !!m.enabled
                        };
                    }));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM modules', (err, rows) => {
                            if (err) reject(err);
                            resolve(rows);
                        });
                    }
                }
            });
        },
        getJobs(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    if (!user.guild) return reject('User is not a member.');

                    if (module.exports.type === 'sqlite') {
                        const job = module.exports.sqlite.database.prepare('SELECT * FROM jobs WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        let global = module.exports.sqlite.database.prepare('SELECT * FROM global_times_worked WHERE user=? AND guild=?').get(user.id, user.guild.id);

                        if (!job) resolve();

                        if (!global) {
                            global = {
                                times_worked: job.amount_of_times_worked
                            };

                            module.exports.sqlite.database.prepare('INSERT INTO global_times_worked(user, guild, times_worked) VALUES(?, ?, ?)').run(user.id, user.guild.id, job.amount_of_times_worked);
                        }


                        resolve({
                            user: job.user,
                            guild: job.guild,
                            job: job.job,
                            tier: job.tier,
                            nextWorkTime: job.next_work_time,
                            amountOfTimesWorked: job.amount_of_times_worked,
                            globalTimesWorked: global.times_worked
                        });
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM jobs WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (rows.length < 1) resolve(undefined);
                            else {
                                module.exports.mysql.database.query('SELECT * FROM global_times_worked WHERE user=? AND guild=?', [user.id, user.guild.id], (err, r) => {
                                    if (!r[0]) {
                                        r[0] = {
                                            times_worked: rows[0].amount_of_times_worked
                                        };

                                        module.exports.mysql.database.query('INSERT INTO global_times_worked(user, guild, times_worked) VALUES(?, ?, ?)', [user.id, user.guild.id, rows[0].amount_of_times_worked], () => { });
                                    }
                                    resolve({
                                        user: rows[0].user,
                                        guild: rows[0].guild,
                                        job: rows[0].job,
                                        tier: rows[0].tier,
                                        nextWorkTime: rows[0].next_work_time,
                                        amountOfTimesWorked: rows[0].amount_of_times_worked,
                                        globalTimesWorked: r[0].times_worked
                                    });
                                });
                            }
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM jobs').all().map(j => {
                        return {
                            user: j.user,
                            guild: j.guild,
                            job: j.job,
                            tier: j.tier,
                            nextWorkTime: j.next_work_time,
                            amountOfTimesWorked: j.amount_of_times_worked
                        };
                    }));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM jobs', (err, rows) => {
                            if (err) reject(err);
                            rows = rows.map(r => {
                                return {
                                    user: r.user,
                                    guild: r.guild,
                                    job: r.job,
                                    tier: r.tier,
                                    nextWorkTime: r.next_work_time,
                                    amountOfTimesWorked: r.amount_of_times_worked
                                };
                            });
                            resolve(rows);
                        });
                    }
                }
            });
        },
        getWorkCooldowns(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    if (!user.guild) return reject('User is not a member.');

                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM job_cooldowns WHERE user=? AND guild=?').get(user.id, user.guild.id));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM job_cooldowns WHERE user=? AND guild=?', [user.id, user.guild.id], (err, cooldowns) => {
                            if (err) reject(err);
                            if (cooldowns.length < 1) resolve(undefined);
                            else resolve(cooldowns[0]);
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM job_cooldowns').all());
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM job_cooldowns', (err, rows) => {
                            if (err) reject(err);
                            resolve(rows);
                        });
                    }
                }
            });
        },
        getDailyCoinsCooldown(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    if (!user.guild) return reject('User is not a member.');

                    if (module.exports.type === 'sqlite') {
                        const cooldown = module.exports.sqlite.database.prepare('SELECT * FROM dailycoinscooldown WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        resolve(cooldown ? cooldown.date : undefined);
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM dailycoinscooldown WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (rows.length < 1) resolve(undefined);
                            else resolve(rows[0].date);
                        });
                    }
                } else reject('User required');
            });
        },
        getGlobalTimesWorked(user) {
            return new Promise((resolve, reject) => {
                if (!user) reject("Invalid paramters in getGlobalTimesWorked");
                if (!user.guild) return reject('User is not a member.');

                if (module.exports.type === 'sqlite') {
                    let global = module.exports.sqlite.database.prepare('SELECT * FROM global_times_worked WHERE user=? AND guild=?').get(user.id, user.guild.id);

                    if (!global) module.exports.sqlite.database.prepare('INSERT INTO global_times_worked(user, guild, times_worked) VALUES(?, ?, ?)').run(user.id, user.guild.id, 0);

                    resolve(global ? global.times_worked : 0);
                }
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM global_times_worked WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {

                        if (!rows.length) module.exports.mysql.database.query('INSERT INTO global_times_worked(user, guild, times_worked) VALUES(?, ?, ?)', [user.id, user.guild.id, 0], () => { });

                        resolve(rows.length ? rows[0].times_worked : 0);
                    });
                }
            });
        },
        getCommands(commandname) {
            return new Promise((resolve, reject) => {
                if (commandname) {
                    if (module.exports.type === 'sqlite') {
                        const command = module.exports.sqlite.database.prepare('SELECT * FROM commands WHERE name=?').get(commandname);
                        if (!command) resolve();
                        else resolve({ name: command.name, enabled: !!command.enabled });
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM commands WHERE name=?', [commandname], (err, rows) => {
                            if (err) reject(err);
                            else resolve(rows[0]);
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM commands').all().map(c => {
                        return {
                            name: c.name,
                            enabled: !!c.enabled
                        };
                    }));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM commands', (err, rows) => {
                            if (err) reject(err);
                            resolve(rows);
                        });
                    }
                }
            });
        },
        getApplications(id) {
            return new Promise((resolve, reject) => {
                if (id) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM applications WHERE channel_id=?').get(id));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM applications WHERE channel_id=?', [id], (err, applications) => {
                        if (err) reject(err);
                        if (applications.length) applications[0].rank = applications[0]._rank;
                        resolve(applications.length ? applications[0] : undefined);
                    });
                } else {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM applications').all());

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM applications', (err, applications) => {
                        if (err) reject(err);
                        if (applications.length) applications = applications.map(app => {
                            app.rank = app._rank;
                            return app;
                        });
                        resolve(applications);
                    });
                }
            });
        },
        application_messages: {
            getMessages(application) {
                return new Promise((resolve, reject) => {
                    if (!application) return reject('Invalid application');

                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM applicationmessages WHERE application=?').all(application));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM applicationmessages WHERE application=?', [application], (err, messages) => {
                            if (err) reject(err);
                            resolve(messages);
                        });
                    }
                });
            },
            getEmbedFields(messageID) {
                return new Promise((resolve, reject) => {
                    if (!messageID) return reject('Invalid messageID');

                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM applicationmessages_embed_fields WHERE message=?').all(messageID));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM applicationmessages_embed_fields WHERE message=?', [messageID], (err, fields) => {
                            if (err) reject(err);
                            resolve(fields);
                        });
                    }
                });
            }
        },
        getSavedRoles(user) {
            return new Promise((resolve, reject) => {
                if (user && user.id && user.guild) {
                    if (module.exports.type === 'sqlite') {
                        let roles = module.exports.sqlite.database.prepare('SELECT * FROM saved_roles WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        resolve(roles ? JSON.parse(roles.roles) : undefined);
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM saved_roles WHERE user=? AND guild=?', [user.id, user.guild.id], (err, roles) => {
                            if (err) reject(err);
                            else resolve(roles.length ? JSON.parse(roles[0].roles) : undefined);
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM saved_roles').all());
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM saved_roles', (err, roles) => {
                            if (err) reject(err);
                            else resolve(roles);
                        });
                    }
                }
            });
        },
        getSavedMuteRoles(user) {
            return new Promise((resolve, reject) => {
                if (user && user.id && user.guild) {
                    if (module.exports.type === 'sqlite') {
                        let roles = module.exports.sqlite.database.prepare('SELECT * FROM saved_mute_roles WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        resolve(roles ? JSON.parse(roles.roles) : undefined);
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM saved_mute_roles WHERE user=? AND guild=?', [user.id, user.guild.id], (err, roles) => {
                            if (err) reject(err);
                            else resolve(roles.length ? JSON.parse(roles[0].roles) : undefined);
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM saved_mute_roles').all());
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM saved_mute_roles', (err, roles) => {
                            if (err) reject(err);
                            else resolve(roles);
                        });
                    }
                }
            });
        },
        getGameData(user) {
            return new Promise((resolve, reject) => {
                if (user && user.id && user.guild) {
                    if (module.exports.type === 'sqlite') {
                        const data = module.exports.sqlite.database.prepare('SELECT * FROM game_data WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!data) resolve();
                        else resolve(JSON.parse(data.data));
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM game_data WHERE user=? AND guild=?', [user.id, user.guild.id], (err, data) => {
                            if (err) reject(err);

                            if (!data.length) resolve(undefined);
                            else resolve(JSON.parse(data[0].data));
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM game_data').all());
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM game_data', (err, data) => {
                            if (err) reject(err);
                            else resolve(data);
                        });
                    }
                }
            });
        },
        getUnloadedAddons() {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM unloaded_addons').all());
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT addon_name FROM unloaded_addons', (err, addons) => {
                        if (err) reject(err);
                        else resolve(addons);
                    });
                }
            });
        },
        getBlacklists(user) {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') {
                    let blacklists = module.exports.sqlite.database.prepare('SELECT * FROM blacklists WHERE user=? AND guild=?').get(user.id, user.guild.id);
                    resolve(blacklists && blacklists.commands && blacklists.commands.length ? JSON.parse(blacklists.commands) : undefined);
                }
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM blacklists WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                        if (err) reject(err);
                        else {
                            let blacklists = rows[0];
                            resolve(blacklists && blacklists.commands && blacklists.commands.length ? JSON.parse(blacklists.commands) : undefined);
                        }
                    });
                }
            });
        },
        getIDBans(guild) {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') {
                    let bans = module.exports.sqlite.database.prepare('SELECT * FROM id_bans WHERE guild=?').all(guild.id);
                    resolve(bans ? bans : []);
                }
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM id_bans WHERE guild=?', [guild.id], (err, rows) => {
                        if (err) reject(err);
                        else {
                            resolve(rows);
                        }
                    });
                }
            });
        },
        getReminders() {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') {
                    let reminders = module.exports.sqlite.database.prepare('SELECT * FROM reminders').all();
                    resolve(reminders ? reminders : []);
                }
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM reminders', [], (err, rows) => {
                        if (err) reject(err);
                        else {
                            resolve(rows);
                        }
                    });
                }
            });
        },
        getAnnouncements() {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') {
                    let announcements = module.exports.sqlite.database.prepare('SELECT * FROM announcements').all();
                    resolve(announcements ? announcements : []);
                }
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM announcements', [], (err, rows) => {
                        if (err) reject(err);
                        else {
                            resolve(rows);
                        }
                    });
                }
            });
        },
        getWeeklyCoinsCooldown(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    if (!user.guild) return reject('User is not a member.');

                    if (module.exports.type === 'sqlite') {
                        const cooldown = module.exports.sqlite.database.prepare('SELECT * FROM weeklycoinscooldown WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        resolve(cooldown ? cooldown.date : undefined);
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM weeklycoinscooldown WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (rows.length < 1) resolve(undefined);
                            else resolve(rows[0].date);
                        });
                    }
                } else reject('User required');
            });
        },
        getSuggestions() {
            return new Promise((resolve, reject) => {
                // SQLITE
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM suggestions').all());

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM suggestions', [], (err, suggestions) => {
                    if (err) reject(err);
                    resolve(suggestions);
                });
            });
        },
        getSuggestionByMessage(id) {
            return new Promise((resolve, reject) => {
                if (id) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM suggestions WHERE message=?').get(id));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM suggestions WHERE message=?', [id], (err, suggestions) => {
                        if (err) reject(err);
                        resolve(suggestions.length ? suggestions[0] : undefined);
                    });
                } else reject("[DATABASE (get.getSuggestion)] Invalid inputs");
            });
        },
        getSuggestionByID(id) {
            return new Promise((resolve, reject) => {
                if (id) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM suggestions WHERE id=?').get(id));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM suggestions WHERE id=?', [id], (err, suggestions) => {
                        if (err) reject(err);
                        resolve(suggestions.length ? suggestions[0] : undefined);
                    });
                } else reject("[DATABASE (get.getSuggestion)] Invalid inputs");
            });
        },
        getBugreport(message_id) {
            return new Promise((resolve, reject) => {
                if (message_id) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM bugreports WHERE message=?').get(message_id));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM bugreports WHERE message=?', [message_id], (err, bugreports) => {
                        if (err) reject(err);
                        resolve(bugreports.length ? bugreports[0] : undefined);
                    });
                } else reject("[DATABASE (get.getBugreport)] Invalid inputs");
            });
        },
        getLockedChannel(channel_id) {
            return new Promise((resolve, reject) => {
                if (channel_id) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM locked_channels WHERE channel=?').get(channel_id));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM locked_channels WHERE channel=?', [channel_id], (err, channels) => {
                        if (err) reject(err);
                        resolve(channels.length ? channels[0] : undefined);
                    });
                } else reject("[DATABASE (get.getLockedChannel)] Invalid inputs");
            });
        },
        getInviteData(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') {
                        let data = module.exports.sqlite.database.prepare('SELECT * FROM invites WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        resolve(data || { regular: 0, bonus: 0, leaves: 0, fake: 0 });
                    }

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM invites WHERE user=? AND guild=?', [user.id, user.guild.id], (err, data) => {
                        if (err) reject(err);
                        resolve(data.length ? data[0] : { regular: 0, bonus: 0, leaves: 0, fake: 0 });
                    });
                } else {
                    // SQLITE
                    if (module.exports.type === 'sqlite') {
                        let data = module.exports.sqlite.database.prepare('SELECT * FROM invites').all();
                        resolve(data);
                    }

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM invites', [], (err, data) => {
                        if (err) reject(err);
                        resolve(data);
                    });
                }
            });
        },
        getJoins(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM joins WHERE user=? AND guild=?').all(user.id, user.guild.id));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM joins WHERE user=? AND guild=?', [user.id, user.guild.id], (err, data) => {
                        if (err) reject(err);
                        resolve(data.length ? data : undefined);
                    });
                } else reject("[DATABASE (get.getJoins)] Invalid inputs");
            });
        },
        getRoleMenus() {
            return new Promise((resolve, reject) => {
                // SQLITE
                if (module.exports.type === 'sqlite') {
                    let data = module.exports.sqlite.database.prepare('SELECT * FROM role_menus').all();
                    resolve(data);
                }

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM role_menus', [], (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });
        },
        getRoleMenu(message) {
            return new Promise((resolve, reject) => {
                // SQLITE
                if (module.exports.type === 'sqlite') {
                    let data = module.exports.sqlite.database.prepare('SELECT * FROM role_menus WHERE message=?').get(message);
                    resolve(data);
                }

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM role_menus WHERE message=?', [message], (err, data) => {
                    if (err) reject(err);
                    resolve(data[0]);
                });
            });
        },
        checkChannelCommandDataExists(command) {
            return new Promise((resolve, reject) => {
                // SQLITE
                if (module.exports.type === 'sqlite') {
                    let data = module.exports.sqlite.database.prepare('SELECT * FROM command_channels WHERE command=?').get(command);
                    resolve(!!data);
                }

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM command_channels WHERE command=?', [command], (err, data) => {
                    if (err) reject(err);
                    resolve(!!data[0]);
                });
            });
        },
        getCommandChannelData(command) {
            return new Promise(async (resolve) => {
                let defaultData = { command: "_global", type: "blacklist", channels: [] };
                // SQLITE
                if (module.exports.type === 'sqlite') {
                    if (await module.exports.get.checkChannelCommandDataExists(command)) {
                        let data = module.exports.sqlite.database.prepare('SELECT * FROM command_channels WHERE command=?').get(command);
                        if (data) data.channels = JSON.parse(data.channels);
                        resolve(data);
                    } else {
                        let data = module.exports.sqlite.database.prepare('SELECT * FROM command_channels WHERE command=?').get("_global");
                        if (data) data.channels = JSON.parse(data.channels);
                        else module.exports.update.commands.channels.add(defaultData);
                        resolve(data || defaultData);
                    }
                }

                // MYSQL
                if (module.exports.type === 'mysql') {
                    if (await module.exports.get.checkChannelCommandDataExists(command)) {
                        module.exports.mysql.database.query('SELECT * FROM command_channels WHERE command=?', [command], (err, data) => {
                            if (data && data.length) data[0].channels = JSON.parse(data[0].channels);
                            resolve(data[0]);
                        });
                    } else {
                        module.exports.mysql.database.query('SELECT * FROM command_channels WHERE command=?', ["_global"], (err, data) => {
                            if (data && data.length) data[0].channels = JSON.parse(data[0].channels);
                            else module.exports.update.commands.channels.add(defaultData);
                            resolve(data[0] || defaultData);
                        });
                    }
                }
            });
        },
        getMessageCount(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    if (!user.guild) return reject('User is not a member.');

                    // SQLITE
                    if (module.exports.type === 'sqlite') {
                        const data = module.exports.sqlite.database.prepare('SELECT * FROM message_counts WHERE user=? AND guild=?').get(user.id, user.guild.id);

                        if (!data) {
                            module.exports.update.messages.increase(user, 0);
                            resolve(0);
                        } else resolve(data.count);
                    }

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM message_counts WHERE user=? AND guild=?', [user.id, user.guild.id], (err, data) => {
                        if (err) reject(err);
                        if (data.length < 1) {
                            module.exports.update.messages.increase(user, 0);
                            resolve(0);
                        }
                        else resolve(data[0].count);
                    });
                } else {

                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM message_counts").all());

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM message_counts', (err, data) => {
                        if (err) reject(err);
                        resolve(data);
                    });
                }
            });
        },
        getVoiceData(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') {
                        let data = module.exports.sqlite.database.prepare('SELECT * FROM voice_time WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        resolve(data);
                    }

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM voice_time WHERE user=? AND guild=?', [user.id, user.guild.id], (err, data) => {
                        if (err) reject(err);
                        resolve(data[0]);
                    });
                } else {
                    //SQLITE
                    if (module.exports.type === 'sqlite') {
                        let data = module.exports.sqlite.database.prepare('SELECT * FROM voice_time').all();
                        resolve(data);
                    }

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM voice_time', [], (err, data) => {
                        if (err) reject(err);
                        resolve(data);
                    });
                }
            });
        },
        getTempchannels() {
            return new Promise((resolve, reject) => {
                //SQLITE
                if (module.exports.type === 'sqlite') {
                    let data = module.exports.sqlite.database.prepare('SELECT * FROM temp_channels').all();
                    resolve(data);
                }

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM temp_channels', [], (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });
        },
        getTempchannelByChannel(channel_id) {
            return new Promise((resolve, reject) => {
                if (!channel_id) return reject("Invalid parameters");

                //SQLITE
                if (module.exports.type === 'sqlite') {
                    let data = module.exports.sqlite.database.prepare('SELECT * FROM temp_channels WHERE channel_id=?').get(channel_id);
                    if (data) data.allowed_users = JSON.parse(data.allowed_users);
                    resolve(data);
                }

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM temp_channels WHERE channel_id=?', [channel_id], (err, data) => {
                    if (err) reject(err);
                    if (data && data.length) data[0].allowed_users = JSON.parse(data[0].allowed_users);
                    resolve(data[0]);
                });
            });
        },
        getTempchannelByUser(user) {
            return new Promise((resolve, reject) => {
                if (!user) return reject("Invalid parameters");

                //SQLITE
                if (module.exports.type === 'sqlite') {
                    let data = module.exports.sqlite.database.prepare('SELECT * FROM temp_channels WHERE owner=?').get(user);
                    if (data) data.allowed_users = JSON.parse(data.allowed_users);
                    resolve(data);
                }

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM temp_channels WHERE owner=?', [user], (err, data) => {
                    if (err) reject(err);
                    if (data && data.length) data[0].allowed_users = JSON.parse(data[0].allowed_users);
                    resolve(data[0]);
                });
            });
        }
    },
    update: {
        prefixes: {
            async updatePrefix(guild, newprefix) {
                return new Promise(async (resolve, reject) => {
                    if ([guild, newprefix].some(t => !t)) return reject('Invalid parameters');

                    if (module.exports.type === 'sqlite') {
                        const prefixes = module.exports.sqlite.database.prepare('SELECT * FROM prefixes WHERE guild=?').all(guild);
                        if (prefixes.length > 0) {
                            module.exports.sqlite.database.prepare('UPDATE prefixes SET prefix=? WHERE guild=?').run(newprefix, guild);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('INSERT INTO prefixes(guild, prefix) VALUES(?, ?)').run(guild, newprefix);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM prefixes WHERE guild=?', [guild], (err, prefixes) => {
                            if (err) reject(err);
                            if (prefixes.length > 0) {
                                module.exports.mysql.database.query('UPDATE prefixes SET prefix=? WHERE guild=?', [newprefix, guild], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('INSERT INTO prefixes(guild, prefix) VALUES(?, ?)', [guild, newprefix], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            }
        },
        tickets: {
            addedUsers: {
                remove(ticket, userid) {
                    if (!userid) return console.log('[Database.js#addedUsers#remove] Invalid inputs');
                    return new Promise((resolve, reject) => {
                        if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('DELETE FROM ticketsaddedusers WHERE ticket=? AND user=?').run(ticket, userid));
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('DELETE FROM ticketsaddedusers WHERE ticket=? AND user=?', [ticket, userid], (err) => {
                                if (err) reject(err);
                                resolve();
                            });
                        }
                    });
                },
                add(ticket, userid) {
                    if (Object.values(arguments).some(a => !a)) return console.log('[Database.js#addedUsers#add] Invalid inputs');
                    return new Promise((resolve, reject) => {
                        if (module.exports.type === 'sqlite') {
                            module.exports.sqlite.database.prepare('INSERT INTO ticketsaddedusers(user, ticket) VALUES(?, ?)').run(userid, ticket);
                            resolve();
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('INSERT INTO ticketsaddedusers(user, ticket) VALUES(?, ?)', [userid, ticket], (err) => {
                                if (err) reject(err);
                                resolve();
                            });
                        }
                    });
                }
            },
            createTicket(data) {
                if (Object.values(arguments).some(a => !a)) return console.log('[Database.js#createTicket] Invalid inputs');
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('INSERT INTO tickets(guild, channel_id, channel_name, creator, reason) VALUES(?, ?, ?, ?, ?)').run(data.guild, data.channel_id, data.channel_name, data.creator, data.reason);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('INSERT INTO tickets(guild, channel_id, channel_name, creator, reason) VALUES(?, ?, ?, ?, ?)', [data.guild, data.channel_id, data.channel_name, data.creator, data.reason], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            },
            removeTicket(id) {
                if (Object.values(arguments).some(a => !a)) return console.log('[Database.js#removeTicket] Invalid inputs');
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('DELETE FROM tickets WHERE channel_id=?').run(id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('DELETE FROM tickets WHERE channel_id=?', [id], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            },
        },
        status: {
            setStatus(type, activity) {
                return new Promise(async (resolve, reject) => {
                    const bot = Utils.variables.bot;
                    if (activity) {
                        bot.user.setActivity(await Utils.getStatusPlaceholders(activity.replace("https://", "")), { type: type.toUpperCase(), url: type.toUpperCase() == "STREAMING" ? activity : undefined });
                    } else bot.user.setActivity();
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE status SET type=?, activity=?').run(type, activity);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE status SET type=?, activity=?', [type, activity], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            }
        },
        coins: {
            updateCoins(user, amt, action) {
                return new Promise(async (resolve, reject) => {
                    if ([user, user.guild, action].some(t => !t)) return reject('Invalid parameters in updateCoins');
                    if (module.exports.type === 'sqlite') {
                        const coins = module.exports.sqlite.database.prepare('SELECT * FROM coins WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        let newcoins;
                        if (coins) {
                            if (action == 'add') newcoins = coins.coins + amt;
                            if (action == 'remove') newcoins = coins.coins - amt;
                            if (action == 'set') newcoins = amt;
                            if (newcoins < 0) newcoins = 0;

                            module.exports.sqlite.database.prepare('UPDATE coins SET coins=? WHERE user=? AND guild=?').run(newcoins, user.id, user.guild.id);
                            resolve();
                        } else {
                            if (['add', 'set'].includes(action)) newcoins = amt;
                            if (action == 'remove') newcoins = 0;
                            if (newcoins < 0) newcoins = 0;

                            module.exports.sqlite.database.prepare('INSERT INTO coins(user, guild, coins) VALUES(?, ?, ?)').run(user.id, user.guild.id, newcoins);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM coins WHERE user=? AND guild=?', [user.id, user.guild.id], (err, coins) => {
                            if (err) reject(err);
                            let newcoins;
                            if (coins.length > 0) {
                                if (action == 'add') newcoins = coins[0].coins + amt;
                                if (action == 'remove') newcoins = coins[0].coins - amt;
                                if (action == 'set') newcoins = amt;
                                if (newcoins < 0) newcoins = 0;

                                module.exports.mysql.database.query('UPDATE coins SET coins=? WHERE user=? AND guild=?', [newcoins, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                if (['add', 'set'].includes(action)) newcoins = amt;
                                if (action == 'remove') newcoins = 0;
                                if (newcoins < 0) newcoins = 0;

                                module.exports.mysql.database.query('INSERT INTO coins(user, guild, coins) VALUES(?, ?, ?)', [user.id, user.guild.id, newcoins], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            },
            setJob(user, job, tier) {
                return new Promise(async (resolve, reject) => {
                    //if ([user, user.guild, job, tier].some(t => !t)) return reject('Invalid parameters in setUserJob');

                    if (module.exports.type === 'sqlite') {
                        const jobFound = module.exports.sqlite.database.prepare('SELECT * FROM jobs WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!jobFound) {
                            module.exports.sqlite.database.prepare('INSERT INTO jobs(user, guild, job, tier, amount_of_times_worked) VALUES(?, ?, ?, ?, ?)').run(user.id, user.guild.id, job, tier, 0);
                            module.exports.sqlite.database.prepare('INSERT INTO global_times_worked(user, guild, times_worked) VALUES(?, ?, ?)').run(user.id, user.guild.id, 0);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('UPDATE jobs SET tier=? WHERE user=? AND guild=?').run(tier, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM jobs WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (!rows[0]) {
                                module.exports.mysql.database.query('INSERT INTO jobs(user, guild, job, tier, amount_of_times_worked) VALUES(?, ?, ?, ?, ?)', [user.id, user.guild.id, job, tier, 0], (err) => {
                                    if (err) reject(err);
                                    module.exports.sqlite.database.prepare('INSERT INTO global_times_worked(user, guild, times_worked) VALUES(?, ?, ?)', [user.id, user.guild.id, 0], (e) => {
                                        if (e) reject(e);
                                        resolve();
                                    });
                                });
                            } else {
                                module.exports.mysql.database.query('UPDATE jobs SET tier=? WHERE user=? AND guild=?', [tier, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            },
            setWorkCooldown(user, date) {
                return new Promise(async (resolve, reject) => {
                    if ([user, user.guild, date].some(t => !t)) return reject('Invalid parameters in setWorkCooldown');

                    if (module.exports.type === 'sqlite') {
                        const cooldown = module.exports.sqlite.database.prepare('SELECT * FROM job_cooldowns WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!cooldown) {
                            module.exports.sqlite.database.prepare('INSERT INTO job_cooldowns(user, guild, date) VALUES(?, ?, ?)').run(user.id, user.guild.id, date);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('UPDATE job_cooldowns SET date=? WHERE user=? AND guild=?').run(date, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM job_cooldowns WHERE user=? AND guild=?', [user.id, user.guild.id], (err, cooldown) => {
                            if (err) reject(err);
                            if (!cooldown.length) {
                                module.exports.mysql.database.query('INSERT INTO job_cooldowns(user, guild, date) VALUES(?, ?, ?)', [user.id, user.guild.id, date], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('UPDATE job_cooldowns SET date=? WHERE user=? AND guild=?', [date, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }

                        });
                    }
                });
            },
            setWorkAmount(user, times) {
                return new Promise(async (resolve, reject) => {
                    if ([user, user.guild, times].some(t => !t)) return reject('Invalid parameters in setWorkAmount');

                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE jobs SET amount_of_times_worked=? WHERE user=? AND guild=?').run(times, user.id, user.guild.id);

                        let global = module.exports.sqlite.database.prepare('SELECT * FROM global_times_worked WHERE user=? AND guild=?').get(user.id, user.guild.id);

                        if (global) {
                            module.exports.sqlite.database.prepare('UPDATE global_times_worked SET times_worked=? WHERE user=? AND guild=?').run((global.times_worked + 1), user.id, user.guild.id);
                        } else {
                            module.exports.sqlite.database.prepare("INSERT INTO global_times_worked(user, guild, times_worked) VALUES(?, ?, ?)").run(user.id, user.guild.id, times);
                        }

                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE jobs SET amount_of_times_worked=? WHERE user=? AND guild=?', [times, user.id, user.guild.id], (err) => {
                            if (err) reject(err);

                            module.exports.mysql.database.query('SELECT * FROM global_times_worked WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                                let global = rows[0];

                                if (global) {
                                    module.exports.mysql.database.query('UPDATE global_times_worked SET times_worked=? WHERE user=? AND guild=?', [(global.times_worked + times), user.id, user.guild.id], (e) => {
                                        if (e) reject(e);
                                        resolve();
                                    });
                                } else {
                                    module.exports.mysql.database.query('INSERT INTO global_times_worked(user, guild, times_worked) VALUES(?, ?, ?)', [user.id, user.guild.id, times], (e) => {
                                        if (e) reject(e);
                                        resolve();
                                    });
                                }
                            });
                        });
                    }
                });
            },
            quitJob(user) {
                return new Promise(async (resolve, reject) => {
                    if ([user, user.guild].some(t => !t)) return reject('Invalid parameters in quitJob');

                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('DELETE FROM jobs WHERE user=? AND guild=?').run(user.id, user.guild.id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM jobs WHERE user=? AND guild=?', [user.id, user.guild.id], (err) => {
                            if (err) reject(err);
                            module.exports.mysql.database.query('DELETE FROM jobs WHERE user=? AND guild=?', [user.id, user.guild.id], (err) => {
                                if (err) reject(err);
                                resolve();
                            });
                        });
                    }
                });
            },
            setDailyCooldown(user, date) {
                return new Promise(async (resolve, reject) => {
                    if ([user, user.guild, date].some(t => !t)) return reject('Invalid parameters in setDailyCooldown');

                    if (module.exports.type === 'sqlite') {
                        const cooldown = module.exports.sqlite.database.prepare('SELECT * FROM dailycoinscooldown WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (cooldown) {
                            module.exports.sqlite.database.prepare('UPDATE dailycoinscooldown SET date=? WHERE user=? AND guild=?').run(date, user.id, user.guild.id);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('INSERT INTO dailycoinscooldown(user, guild, date) VALUES(?,?,?)').run(user.id, user.guild.id, date);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM dailycoinscooldown WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (rows.length > 0) {
                                module.exports.mysql.database.query('UPDATE dailycoinscooldown SET date=? WHERE user=? AND guild=?', [date, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('INSERT INTO dailycoinscooldown(user, guild, date) VALUES(?,?,?)', [user.id, user.guild.id, date], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            },
            setWeeklyCooldown(user, date) {
                return new Promise(async (resolve, reject) => {
                    if ([user, user.guild, date].some(t => !t)) return reject('Invalid parameters in setWeeklyCooldown');

                    if (module.exports.type === 'sqlite') {
                        const cooldown = module.exports.sqlite.database.prepare('SELECT * FROM weeklycoinscooldown WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (cooldown) {
                            module.exports.sqlite.database.prepare('UPDATE weeklycoinscooldown SET date=? WHERE user=? AND guild=?').run(date, user.id, user.guild.id);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('INSERT INTO weeklycoinscooldown(user, guild, date) VALUES(?,?,?)').run(user.id, user.guild.id, date);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM weeklycoinscooldown WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (rows.length > 0) {
                                module.exports.mysql.database.query('UPDATE weeklycoinscooldown SET date=? WHERE user=? AND guild=?', [date, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('INSERT INTO weeklycoinscooldown(user, guild, date) VALUES(?,?,?)', [user.id, user.guild.id, date], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            }
        },
        experience: {
            updateExperience(user, level, xp, action) {
                return new Promise(async (resolve, reject) => {
                    if ([user, user.guild].some(t => !t) || isNaN(level) || isNaN(xp)) return reject('Invalid parameters in updateExperience');

                    if (module.exports.type === 'sqlite') {
                        const experience = module.exports.sqlite.database.prepare('SELECT * FROM experience WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        let newxp;
                        if (experience) {
                            if (action == 'add') newxp = experience.xp + xp;
                            if (action == 'remove') newxp = experience.xp - xp;
                            if (action == 'set') newxp = xp;
                            if (newxp < 0) newxp = 0;
                            if (level < 1) level = 1;

                            module.exports.sqlite.database.prepare('UPDATE experience SET level=?, xp=? WHERE user=? AND guild=?').run(level, newxp, user.id, user.guild.id);
                            resolve();
                        } else {
                            if (['add', 'set'].includes(action)) newxp = xp;
                            if (action == 'remove') newxp = 0;
                            if (newxp < 0) newxp = 0;
                            if (level < 1) level = 1;

                            module.exports.sqlite.database.prepare('INSERT INTO experience(user, guild, level, xp) VALUES(?, ?, ?, ?)').run(user.id, user.guild.id, level, newxp);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM experience WHERE user=? AND guild=?', [user.id, user.guild.id], (err, experience) => {
                            if (err) reject(err);
                            let newxp;
                            if (experience.length > 0) {
                                if (action == 'add') newxp = experience[0].xp + xp;
                                if (action == 'remove') newxp = experience[0].xp - xp;
                                if (action == 'set') newxp = xp;
                                if (newxp < 0) newxp = 0;
                                if (level < 1) level = 1;

                                module.exports.mysql.database.query('UPDATE experience SET level=?, xp=? WHERE user=? AND guild=?', [level, newxp, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                if (['add', 'set'].includes(action)) newxp = xp;
                                if (action == 'remove') newxp = 0 - xp;
                                if (newxp < 0) newxp = 0;
                                if (level < 1) level = 1;

                                module.exports.mysql.database.query('INSERT INTO experience(user, guild, level, xp) VALUES(?, ?, ?, ?)', [user.id, user.guild.id, level, newxp], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            }
        },
        filter: {
            addWord(words) {
                return new Promise((resolve, reject) => {
                    if (!Array.isArray(words)) words = [words];
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare(`INSERT INTO filter(word) VALUES ${words.map(() => `(?)`)}`).run(...words);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query(`INSERT INTO filter(word) VALUES ${words.map(() => `(?)`)}`, words, (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            },
            removeWord(words) {
                return new Promise((resolve, reject) => {
                    if (!Array.isArray(words)) words = [words];
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare(`DELETE FROM filter WHERE ${words.map(() => `word=?`).join(" OR ")}`).run(words);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query(`DELETE FROM filter WHERE ${words.map(() => `word=?`).join(" OR ")}`, words, (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            }
        },
        giveaways: {
            addGiveaway(data) {
                return new Promise((resolve, reject) => {
                    if (['guild', 'channel', 'message', 'prize', 'start', 'end', 'amount_of_winners', 'host'].some(d => !data[d]) || ['start', 'end', 'amount_of_winners'].some(d => isNaN(data[d]))) return reject("Invalid data.");

                    if (module.exports.type == 'sqlite') {
                        module.exports.sqlite.database.prepare('INSERT INTO giveaways(guild, channel, message, prize, description, start, end, amount_of_winners, host, requirements, ended, winners) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
                            .run(data.guild, data.channel.id, data.message, data.prize, data.description, data.start, data.end, data.amount_of_winners, data.host.user.id, data.requirements ? JSON.stringify(data.requirements) : "{}", 0, "[]");
                        resolve();
                    }

                    if (module.exports.type == 'mysql') {
                        module.exports.mysql.database.query('INSERT INTO giveaways(guild, channel, message, prize, description, start, end, amount_of_winners, host, requirements, ended, winners) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                            [data.guild, data.channel.id, data.message, data.prize, data.description, data.start, data.end, data.amount_of_winners, data.host.user.id, data.requirements ? JSON.stringify(data.requirements) : "{}", false, "[]"], err => {
                                if (err) console.log(err);
                                resolve();
                            });
                    }
                });
            },
            deleteGiveaway(id) {
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('DELETE FROM giveaways WHERE message=?').run(id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('DELETE FROM giveaways WHERE message=?', [id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            setToEnded(id) {
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE giveaways SET ended=? WHERE message=?').run(1, id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE giveaways SET ended=? WHERE message=?', [true, id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            setWinners(winners, id) {
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE giveaways SET winners=? WHERE message=?').run(winners, id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE giveaways SET winners=? WHERE message=?', [winners, id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            reactions: {
                addReaction(giveaway, user, entries = 1) {
                    return new Promise((resolve, reject) => {
                        if (!giveaway || !user) return reject('Invalid giveaway or user.');

                        if (module.exports.type === 'sqlite') {
                            module.exports.sqlite.database.prepare('INSERT INTO giveawayreactions(giveaway, user, entries) VALUES(?, ?, ?)').run(giveaway, user, entries);
                            resolve();
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('INSERT INTO giveawayreactions(giveaway, user, entries) VALUES(?, ?, ?)', [giveaway, user, entries], (err) => {
                                if (err) reject(err);
                                resolve();
                            });
                        }
                    });
                },
                removeReaction(giveaway, user) {
                    return new Promise((resolve, reject) => {
                        if (!giveaway || !user) return reject('Invalid giveaway or user.');

                        if (module.exports.type === 'sqlite') {
                            module.exports.sqlite.database.prepare('DELETE FROM giveawayreactions WHERE giveaway=? AND user=?').run(giveaway, user);
                            resolve();
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('DELETE FROM giveawayreactions WHERE giveaway=? AND user=?', [giveaway, user], (err) => {
                                if (err) reject(err);
                                resolve();
                            });
                        }
                    });
                }
            }
        },
        punishments: {
            addPunishment(data) {
                return new Promise((resolve, reject) => {
                    if (['type', 'user', 'tag', 'reason', 'time', 'executor'].some(a => !data[a])) return reject('Invalid arguments for addPunishment');

                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('INSERT INTO punishments(type, user, tag, reason, time, executor, length, complete) VALUES(?, ?, ?, ?, ?, ?, ?, ?)').run(data.type, data.user, data.tag, data.reason, data.time, data.executor, data.length, 0);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('INSERT INTO punishments(type, user, tag, reason, time, executor, length, complete) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [data.type, data.user, data.tag, data.reason, data.time, data.executor, data.length, 0], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            removePunishment(id) {
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('DELETE FROM punishments WHERE id=?').run(id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('DELETE FROM punishments WHERE id=?', [id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            addWarning(data) {
                return new Promise((resolve, reject) => {
                    if (['user', 'tag', 'reason', 'time', 'executor'].some(a => !data[a])) return reject('Invalid arguments for addWarning');

                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('INSERT INTO warnings(user, tag, reason, time, executor) VALUES(?, ?, ?, ?, ?)').run(data.user, data.tag, data.reason, data.time, data.executor);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('INSERT INTO warnings(user, tag, reason, time, executor) VALUES(?, ?, ?, ?, ?)', [data.user, data.tag, data.reason, data.time, data.executor], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            removeWarning(id) {
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('DELETE FROM warnings WHERE id=?').run(id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('DELETE FROM warnings WHERE id=?', [id], (err) => {
                            if (err) reject(err);
                            else resolve(err);
                        });
                    }
                });
            },
            completePunishment(id) {
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE punishments SET complete=1 WHERE id=?').run(id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE punishments SET complete=1 WHERE id=?', [id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        modules: {
            setModule(modulename, enabled) {
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE modules SET enabled=? WHERE name=?').run(enabled ? 1 : 0, modulename);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE modules SET enabled=? WHERE name=?', [enabled, modulename], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        commands: {
            setCommand(commandname, enabled) {
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE commands SET enabled=? WHERE name=?').run(enabled ? 1 : 0, commandname);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE commands SET enabled=? WHERE name=?', [enabled, commandname], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            channels: {
                add(data) {
                    return new Promise((resolve, reject) => {
                        if (!data || !data.command || !data.type || !data.channels) return reject('[DATABASE (update.commands.channels.add)] Invalid inputs');

                        if (module.exports.type === 'sqlite') {
                            module.exports.sqlite.database.prepare('INSERT INTO command_channels VALUES(?, ?, ?)').run(data.command, data.type, JSON.stringify(data.channels));
                            resolve();
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('INSERT INTO command_channels VALUES(?, ?, ?)', [data.command, data.type, JSON.stringify(data.channels)], (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        }
                    });
                },
                remove(command) {
                    return new Promise((resolve, reject) => {
                        if (!command) return reject('[DATABASE (update.commands.channels.add)] Invalid inputs');

                        if (module.exports.type === 'sqlite') {
                            module.exports.sqlite.database.prepare('DELETE FROM command_channels WHERE command=?').run(command);
                            resolve();
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('DELETE FROM command_channels WHERE command=?', [command], (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        }
                    });
                },
                updateType(command, type) {
                    return new Promise((resolve, reject) => {
                        if (!command || !type) return reject('[DATABASE (update.commands.channels.updateType)] Invalid inputs');

                        if (module.exports.type === 'sqlite') {
                            module.exports.sqlite.database.prepare('UPDATE command_channels SET type=? WHERE command=?').run(type, command);
                            resolve();
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('UPDATE command_channels SET type=? WHERE command=?', [type, command], (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        }
                    });
                },
                updateChannels(command, channels) {
                    return new Promise((resolve, reject) => {
                        if (!command || !channels) return reject('[DATABASE (update.commands.channels.updateChannels)] Invalid inputs');

                        if (module.exports.type === 'sqlite') {
                            module.exports.sqlite.database.prepare('UPDATE command_channels SET channels=? WHERE command=?').run(JSON.stringify(channels), command);
                            resolve();
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('UPDATE command_channels SET channels=? WHERE command=?', [JSON.stringify(channels), command], (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        }
                    });
                }
            }
        },
        applications: {
            createApplication(data) {
                if (Object.values(data).some(a => !a)) return console.log('[DATABASE (update.applications.createApplication] Invalid inputs');
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('INSERT INTO applications(guild, channel_id, channel_name, creator, status) VALUES(?, ?, ?, ?, ?)').run(data.guild, data.channel_id, data.channel_name, data.creator, "Pending");
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('INSERT INTO applications(guild, channel_id, channel_name, creator, status, _rank, questions_answers) VALUES(?, ?, ?, ?, ?, ?, ?)', [data.guild, data.channel_id, data.channel_name, data.creator, "Pending", " ", " "], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            },
            completeApplication(id, rank, questions_answers) {
                if (!id || !rank || !questions_answers) return console.log('[DATABASE (update.applications.createApplication] Invalid inputs');
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE applications SET rank=?, questions_answers=? WHERE channel_id=?').run(rank, questions_answers, id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE applications SET _rank=?, questions_answers=? WHERE channel_id=?', [rank, questions_answers, id], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            },
            setStatus(id, status) {
                if (!id || !status) return console.log('[DATABASE (update.applications.setStatus)] Invalid inputs');
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE applications SET status=? WHERE channel_id=?').run(status, id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE applications SET status=? WHERE channel_id=?', [status, id], function (err) {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            }
        },
        roles: {
            setSavedRoles(user, roles) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !user.id || !user.guild || !roles || typeof roles !== 'string') return reject('[DATABASE (update.roles.setSavedRoles)] Invalid inputs');

                    if (module.exports.type === 'sqlite') {
                        const savedRoles = module.exports.sqlite.database.prepare('SELECT * FROM saved_roles WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!savedRoles) {
                            module.exports.sqlite.database.prepare('INSERT INTO saved_roles(user, guild, roles) VALUES(?, ?, ?)').run(user.id, user.guild.id, roles);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('UPDATE saved_roles SET roles=? WHERE user=? AND guild=?').run(roles, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM saved_roles WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (!rows[0]) {
                                module.exports.mysql.database.query('INSERT INTO saved_roles(user, guild, roles) VALUES(?, ?, ?)', [user.id, user.guild.id, roles], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('UPDATE saved_roles SET roles=? WHERE user=? AND guild=?', [roles, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            },
            setSavedMuteRoles(user, roles) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !user.id || !user.guild || !roles || typeof roles !== 'string') return reject('[DATABASE (update.roles.setSavedMuteRoles)] Invalid inputs');

                    if (module.exports.type === 'sqlite') {
                        const savedRoles = module.exports.sqlite.database.prepare('SELECT * FROM saved_mute_roles WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!savedRoles) {
                            module.exports.sqlite.database.prepare('INSERT INTO saved_mute_roles(user, guild, roles) VALUES(?, ?, ?)').run(user.id, user.guild.id, roles);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('UPDATE saved_mute_roles SET roles=? WHERE user=? AND guild=?').run(roles, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM saved_mute_roles WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (!rows[0]) {
                                module.exports.mysql.database.query('INSERT INTO saved_mute_roles(user, guild, roles) VALUES(?, ?, ?)', [user.id, user.guild.id, roles], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('UPDATE saved_mute_roles SET roles=? WHERE user=? AND guild=?', [roles, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            }
        },
        games: {
            setData(user, data) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !user.id || !user.guild || !data || typeof data !== 'string') return reject('[DATABASE (update.games.setData)] Invalid inputs');

                    if (module.exports.type === 'sqlite') {
                        const gameData = module.exports.sqlite.database.prepare('SELECT * FROM game_data WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!gameData) {
                            module.exports.sqlite.database.prepare('INSERT INTO game_data(user, guild, data) VALUES(?, ?, ?)').run(user.id, user.guild.id, data);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('UPDATE game_data SET data=? WHERE user=? AND guild=?').run(data, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM game_data WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (!rows[0]) {
                                module.exports.mysql.database.query('INSERT INTO game_data(user, guild, data) VALUES(?, ?, ?)', [user.id, user.guild.id, data], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('UPDATE game_data SET data=? WHERE user=? AND guild=?', [data, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            }
        },
        addons: {
            setUnloaded(addon_name) {
                return new Promise(async (resolve, reject) => {
                    if (!addon_name) return reject('[DATABASE (update.addons.setUnloaded)] Invalid inputs');

                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare("INSERT INTO unloaded_addons(addon_name) VALUES(?)").run(addon_name);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('INSERT INTO unloaded_addons(addon_name) VALUES(?)', [addon_name], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            },
            setLoaded(addon_name) {
                return new Promise(async (resolve, reject) => {
                    if (!addon_name) return reject('[DATABASE (update.addons.setLoaded)] Invalid inputs');

                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare("DELETE FROM unloaded_addons WHERE addon_name=?").run(addon_name);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('DELETE FROM unloaded_addons WHERE addon_name=?', [addon_name], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            }
        },
        blacklists: {
            addBlacklist(user, command) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !command) return reject('[DATABASE (update.blacklists.addBlacklist)] Invalid inputs');
                    let blacklists = await module.exports.get.getBlacklists(user);

                    if (!blacklists) {
                        if (module.exports.type == "sqlite") module.exports.sqlite.database.prepare("INSERT INTO blacklists VALUES(?, ?, ?)").run(user.id, user.guild.id, " ");
                        if (module.exports.type == "mysql") await module.exports.mysql.database.query("INSERT INTO blacklists VALUES(?, ?, ?)", [user.id, user.guild.id, " "], (err) => {
                            if (err) reject(err);
                        });
                        blacklists = [];
                    }

                    blacklists.push(command);

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("UPDATE blacklists SET commands=? WHERE user=? AND guild=?").run(JSON.stringify(blacklists), user.id, user.guild.id);
                        resolve();
                    }
                    if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("UPDATE blacklists SET commands=? WHERE user=? AND guild=?", [JSON.stringify(blacklists), user.id, user.guild.id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            removeBlacklist(user, command) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !command) return reject('[DATABASE (update.blacklists.removeBlacklist)] Invalid inputs');
                    let blacklists = await module.exports.get.getBlacklists(user);

                    if (!blacklists) blacklists = [];

                    if (blacklists.indexOf(command) >= 0) blacklists.splice(blacklists.indexOf(command), 1);

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("UPDATE blacklists SET commands=? WHERE user=? AND guild=?").run(JSON.stringify(blacklists), user.id, user.guild.id);
                        resolve();
                    }
                    if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("UPDATE blacklists SET commands=? WHERE user=? AND guild=?", [JSON.stringify(blacklists), user.id, user.guild.id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        id_bans: {
            add(guild, id, executor, reason) {
                return new Promise(async (resolve, reject) => {
                    if (!id || !guild || !executor) return reject('[DATABASE (update.id_bans.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO id_bans(guild, id, executor, reason) VALUES(?, ?, ?, ?)").run(guild.id, id, executor.id, reason ? reason : null);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO id_bans(guild, id, executor, reason) VALUES(?, ?, ?, ?)", [guild.id, id, executor.id, reason ? reason : null], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            remove(guild, id) {
                return new Promise(async (resolve, reject) => {
                    if (!id || !guild) return reject('[DATABASE (update.id_bans.remove)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("DELETE FROM id_bans WHERE guild=? AND id=?").run(guild.id, id);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("DELETE FROM id_bans WHERE guild=? AND id=?", [guild.id, id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        reminders: {
            add(member, time, text) {
                return new Promise(async (resolve, reject) => {
                    if (!member || !time || !text) return reject('[DATABASE (update.reminders.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO reminders(member, time, reminder) VALUES(?, ?, ?)").run(member.user.id, time, text);
                        let reminders = await module.exports.get.getReminders();
                        resolve(Math.max(...reminders.map(r => r.id)));
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO reminders(member, time, reminder) VALUES(?, ?, ?)", [member.user.id, time, text], async (err) => {
                            if (err) reject(err);
                            else {
                                let reminders = await module.exports.get.getReminders();
                                resolve(Math.max(...reminders.map(r => r.id)));
                            }
                        });
                    }
                });
            },
            remove(id) {
                return new Promise(async (resolve, reject) => {
                    if (!id) return reject('[DATABASE (update.reminders.remove)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("DELETE FROM reminders WHERE id=?").run(id);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("DELETE FROM reminders WHERE id=?", [id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        announcements: {
            add(announcement) {
                return new Promise(async (resolve, reject) => {
                    if (["Channel", "Interval", "Type"].some(property => !announcement[property]) || (!announcement.Embed && !announcement.Content)) return reject('[DATABASE (update.announcements.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO announcements(announcement_data) VALUES(?)").run(JSON.stringify(announcement));
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO announcements(announcement_data) VALUES(?)", [JSON.stringify(announcement)], async (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            remove(id) {
                if (!id) return console.log('[DATABASE (update.announcements.remove)] Invalid inputs');
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('DELETE FROM announcements WHERE id=?').run(id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('DELETE FROM announcements WHERE id=?', [id], function (err) {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            },
            setNextBroadcast(id, date) {
                if (!id || !date) return console.log('[DATABASE (update.announcements.setNextBroadcast)] Invalid inputs');
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE announcements SET next_broadcast=? WHERE id=?').run(date, id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE announcements SET next_broadcast=? WHERE id=?', [date, id], function (err) {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            }
        },
        suggestions: {
            add(data) {
                return new Promise(async (resolve, reject) => {
                    if (["guild", "channel", "message", "suggestion", "creator", "status", "votes", "created_on"].some(p => !data[p])) return reject('[DATABASE (update.suggestions.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO suggestions(guild, channel, message, suggestion, creator, status, votes, created_on, image) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)").run(...Object.values(data));
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO suggestions(guild, channel, message, suggestion, creator, status, votes, created_on, image) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", Object.values(data), async (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            setStatus(channel, message, status, votes, changedBy, old_message) {
                return new Promise(async (resolve, reject) => {
                    if (!channel || !message || !status || !votes || !changedBy || !old_message) return reject('[DATABASE (update.suggestions.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("UPDATE suggestions SET channel=?, message=?, status=?, status_changed_on=?, votes=?, status_changed_by=? WHERE message=?").run(channel, message, status, Date.now(), JSON.stringify(votes), changedBy, old_message);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("UPDATE suggestions SET channel=?, message=?, status=?, status_changed_on=?, votes=?, status_changed_by=? WHERE message=?", [channel, message, status, Date.now(), JSON.stringify(votes), changedBy, old_message], async (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        bugreports: {
            // guild text, channel text, message text, suggestion text, creator text, status text, votes text, created_on integer, status_changed_on integer
            add(data) {
                return new Promise(async (resolve, reject) => {
                    if (["guild", "channel", "message", "bug", "creator", "status", "created_on"].some(p => !data[p])) return reject('[DATABASE (update.bugreports.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO bugreports(guild, channel, message, bug, creator, status, created_on, image) VALUES(?, ?, ?, ?, ?, ?, ?, ?)").run(...Object.values(data));
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO bugreports(guild, channel, message, bug, creator, status, created_on, image) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", Object.values(data), async (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            setStatus(channel, message, status, changedBy, old_message) {
                return new Promise(async (resolve, reject) => {
                    if (!channel || !message || !status || !changedBy || !old_message) return reject('[DATABASE (update.bugreports.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("UPDATE bugreports SET channel=?, message=?, status=?, status_changed_on=?, status_changed_by=? WHERE message=?").run(channel, message, status, Date.now(), changedBy, old_message);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("UPDATE bugreports SET channel=?, message=?, status=?, status_changed_on=?, status_changed_by=? WHERE message=?", [channel, message, status, Date.now(), changedBy, old_message], async (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        locked_channels: {
            add(guild, channel, permissions) {
                return new Promise(async (resolve, reject) => {
                    if (!guild || !channel || !permissions) return reject('[DATABASE (update.locked_channels.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO locked_channels(guild, channel, permissions) VALUES(?, ?, ?)").run(guild, channel, JSON.stringify(permissions));
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO locked_channels(guild, channel, permissions) VALUES(?, ?, ?)", [guild, channel, JSON.stringify(permissions)], async (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            remove(guild, channel) {
                return new Promise(async (resolve, reject) => {
                    if (!guild || !channel) return reject('[DATABASE (update.locked_channels.remove)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("DELETE FROM locked_channels WHERE guild=? AND channel=?").run(guild, channel);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("DELETE FROM locked_channels WHERE guild=? AND channel=?", [guild, channel], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        invites: {
            updateData(user, data) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !data) return reject('[DATABASE (update.invites.updateData)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        let inviteData = module.exports.sqlite.database.prepare("SELECT * FROM invites WHERE user=? AND guild=?").get(user.id, user.guild.id);
                        if (inviteData) {
                            module.exports.sqlite.database.prepare("UPDATE invites SET regular=?, bonus=?, leaves=?, fake=? WHERE user=? AND guild=?").run(data.regular, data.bonus, data.leaves, data.fake, user.id, user.guild.id);
                        } else {
                            module.exports.sqlite.database.prepare("INSERT INTO invites(guild, user, regular, bonus, leaves, fake) VALUES(?, ?, ?, ?, ?, ?)").run(user.guild.id, user.id, data.regular, data.bonus, data.leaves, data.fake);
                        }
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("SELECT * FROM invites WHERE user=? AND guild=?", [user.id, user.guild.id], (err, inviteData) => {
                            if (inviteData.length) {
                                module.exports.mysql.database.query("UPDATE invites SET regular=?, bonus=?, leaves=?, fake=? WHERE user=? AND guild=?", [data.regular, data.bonus, data.leaves, data.fake, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            } else {
                                module.exports.mysql.database.query("INSERT INTO invites(guild, user, regular, bonus, leaves, fake) VALUES(?, ?, ?, ?, ?, ?)", [user.guild.id, user.id, data.regular, data.bonus, data.leaves, data.fake], (err) => {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            }
                        });
                    }
                });
            },
            addJoin(user, inviter) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !inviter) return reject('[DATABASE (update.invites.addJoin)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO joins(guild, user, inviter, time) VALUES(?, ?, ?, ?)").run(user.guild.id, user.id, inviter.id, Date.now());
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO joins(guild, user, inviter, time) VALUES(?, ?, ?, ?)", [user.guild.id, user.id, inviter.id, Date.now()], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
        },
        role_menus: {
            add(message, name) {
                return new Promise(async (resolve, reject) => {
                    if (!message) return reject('[DATABASE (update.role_menus.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO role_menus(guild, channel, message, name) VALUES(?, ?, ?, ?)").run(message.guild.id, message.channel.id, message.id, name.toLowerCase());
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO role_menus(guild, channel, message, name) VALUES(?, ?, ?, ?)", [message.guild.id, message.channel.id, message.id, name.toLowerCase()], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            remove(message) {
                return new Promise(async (resolve, reject) => {
                    if (!message) return reject('[DATABASE (update.role_menus.remove)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("DELETE FROM role_menus WHERE message=?").run(message);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("DELETE FROM role_menus WHERE message=?", [message], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        messages: {
            increase(user, amount = 1) {
                return new Promise(async (resolve, reject) => {
                    if (!user || typeof amount != "number" || !user.id || !user.guild) return reject('[DATABASE (update.messages.increase)] Invalid inputs');

                    if (module.exports.type === 'sqlite') {
                        const data = module.exports.sqlite.database.prepare('SELECT * FROM message_counts WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!data) {
                            module.exports.sqlite.database.prepare('INSERT INTO message_counts(guild, user, count) VALUES(?, ?, ?)').run(user.guild.id, user.id, amount);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('UPDATE message_counts SET count=? WHERE user=? AND guild=?').run(data.count + amount, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM message_counts WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (!rows[0]) {
                                module.exports.mysql.database.query('INSERT INTO message_counts(guild, user, count) VALUES(?, ?, ?)', [user.guild.id, user.id, amount], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('UPDATE message_counts SET count=? WHERE user=? AND guild=?', [rows[0].count + amount, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            },
            decrease(amount = 1) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !amount || !user.id || !user.guild) return reject('[DATABASE (update.messages.increase)] Invalid inputs');

                    if (module.exports.type === 'sqlite') {
                        const data = module.exports.sqlite.database.prepare('SELECT * FROM message_counts WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (data) {
                            module.exports.sqlite.database.prepare('UPDATE message_counts SET count=? WHERE user=? AND guild=?').run(data.count - amount > 0 ? data.count - count : 0, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM message_counts WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (rows[0]) {
                                module.exports.mysql.database.query('UPDATE message_counts SET count=? WHERE user=? AND guild=?', [rows[0].count - amount > 0 ? rows[0].count - count : 0, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            }
        },
        voice_time: {
            updateJoinTime(user, time) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !user.guild) return reject('[DATABASE (update.voice_time.updateJoinTime)] Invalid inputs');

                    time = time ? time : null;

                    if (module.exports.type === 'sqlite') {
                        const data = module.exports.sqlite.database.prepare('SELECT * FROM voice_time WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!data) {
                            module.exports.sqlite.database.prepare('INSERT INTO voice_time(guild, user, total_time, join_date) VALUES(?, ?, ?, ?)').run(user.guild.id, user.id, 0, time);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('UPDATE voice_time SET join_date=? WHERE user=? AND guild=?').run(time, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM voice_time WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (!rows[0]) {
                                module.exports.mysql.database.query('INSERT INTO voice_time(guild, user, total_time, join_date) VALUES(?, ?, ?, ?)', [user.guild.id, user.id, 0, time], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('UPDATE voice_time SET join_date=? WHERE user=? AND guild=?', [time, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            },
            addVoiceTime(user, amount) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !user.guild || isNaN(amount)) return reject('[DATABASE (update.voice_time.addVoiceTime)] Invalid inputs');

                    if (module.exports.type === 'sqlite') {
                        const data = module.exports.sqlite.database.prepare('SELECT * FROM voice_time WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!data) {
                            module.exports.sqlite.database.prepare('INSERT INTO voice_time(guild, user, total_time, join_date) VALUES(?, ?, ?, ?)').run(user.guild.id, user.id, amount, null);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('UPDATE voice_time SET total_time=? WHERE user=? AND guild=?').run(data.total_time + amount, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM voice_time WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (!rows[0]) {
                                module.exports.mysql.database.query('INSERT INTO voice_time(guild, user, total_time, join_date) VALUES(?, ?, ?, ?)', [user.guild.id, user.id, amount, null], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('UPDATE voice_time SET total_time=? WHERE user=? AND guild=?', [rows[0].total_time + amount, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            }
        },
        temp_channels: {
            create(channel, owner, settings) {
                return new Promise(async (resolve, reject) => {
                    if (!channel || !owner || !settings) return reject('[DATABASE (update.temp_channels.create)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO temp_channels(guild, channel_id, channel_name, owner, public, allowed_users, max_members, bitrate) VALUES(?, ?, ?, ?, ?, ?, ?, ?)").run(channel.guild.id, channel.id, channel.name, owner.id, settings.public ? 1 : 0, JSON.stringify(settings.allowed_users), settings.max_members, settings.bitrate);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO temp_channels(guild, channel_id, channel_name, owner, public, allowed_users, max_members, bitrate) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", [channel.guild.id, channel.id, channel.name, owner.id, settings.public, JSON.stringify(settings.allowed_users), settings.max_members, settings.bitrate], async (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            delete(guild_id, channel_id) {
                return new Promise(async (resolve, reject) => {
                    if (!guild_id || !channel_id) return reject('[DATABASE (update.temp_channels.delete)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("DELETE FROM temp_channels WHERE guild=? AND channel_id=?").run(guild_id, channel_id);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("DELETE FROM temp_channels WHERE guild=? AND channel_id=?", [guild_id, channel_id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            update(channel_id, setting, value) {
                return new Promise(async (resolve, reject) => {
                    if (!channel_id || !setting) return reject('[DATABASE (update.temp_channels.update)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare(`UPDATE temp_channels SET ${setting}=? WHERE channel_id=?`).run(value, channel_id);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query(`UPDATE temp_channels SET ${setting}=? WHERE channel_id=?`, [value, channel_id], async (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        }
    }
};
// CRACKED BY OGs