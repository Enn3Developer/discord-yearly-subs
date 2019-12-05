const config = require('../config');

const dbModel = require('./db.model');
const Discord = require('discord.js');

const PREFIX_LOG_DISCORDJS = '\x1b[37m[Discord.js]\x1b[0m ';
const PREFIX_LOG_ERROR = '\x1b[31m[Error]\x1b[0m ';

module.exports = {
  initialize() {
    // initial checks
    if (!config) return console.log(PREFIX_LOG_ERROR + 'Configuration is missing');

    if (!config.intervalCheck) return console.log(PREFIX_LOG_ERROR + 'Interval check is missing in configuration');
    if (config.intervalCheck <= 10) return console.log(PREFIX_LOG_ERROR + 'Interval check is too low');

    if (!config.discordBotToken) return console.log(PREFIX_LOG_ERROR + 'Bot token is missing in configuration');
    if (!config.discordGuildId) return console.log(PREFIX_LOG_ERROR + 'Guild ID is missing in configuration');
    if (!config.discordRoles) return console.log(PREFIX_LOG_ERROR + 'Roles configuration is missing');

    // start
    console.log('\x1b[36mDiscord Yearly Subscription\x1b[0m manager started\n');

    // read data from storage/db.json
    this.db = dbModel.readData();

    // discord client
    this.client = new Discord.Client();

    // on ready callback
    this.client.on('ready', () => {
      console.log(PREFIX_LOG_DISCORDJS + `Logged in as ${this.client.user.tag}!`);

      this.guild = this.client.guilds.find(g => g.id === config.discordGuildId);
      if (!this.guild) return console.error(PREFIX_LOG_ERROR + 'Bot isn\'t in this guild');

      // do user checks
      this.fetchDiscordMembers();

      // repeat every X seconds
      setInterval(() => this.fetchDiscordMembers(), config.intervalCheck * 1000);
    });

    // do login
    this.client.login(config.discordBotToken).catch(() => {
      console.error(PREFIX_LOG_ERROR + 'Unable to connect, invalid token');
    });
  },

  /**
   * Fetch users from Discord server
   *
   * @returns {Promise<void>}
   */
  async fetchDiscordMembers() {
    const rolePatron = this.guild.roles.find(r => r.id === config.discordRoles.trigger);
    const roleYearly = this.guild.roles.find(r => r.id === config.discordRoles.yearlySub);

    if (!rolePatron) return console.error(PREFIX_LOG_ERROR + 'Defined `trigger` role in configuration isn\'t valid');
    if (!roleYearly) return console.error(PREFIX_LOG_ERROR + 'Defined `yearly sub` role in configuration isn\'t valid');

    if (this.isNewYear()) {

      // happy new year lol. remove yearly role to all users
      await this.guild.fetchMembers().then(() => {

        this.db.currentYear = new Date().getFullYear();
        this.db.discordYearlySubs = {};
        this.db.patrons = {};

        this.guild.members.forEach((member) => {
          // add yearly role to new members
          if (member.roles.has(roleYearly.id)) {

            member.removeRole(roleYearly)
              .then(() =>
                console.log(PREFIX_LOG_DISCORDJS + 'Yearly subscriptions has been reset')
              )
              .catch((err) =>
                console.error(PREFIX_LOG_ERROR + err)
              );

          }
        });

        dbModel.writeData(this.db);
      });

    } else {

      // add yearly role to patrons
      await this.guild.fetchMembers().then(() => {
        this.db.discordYearlySubs = {};
        this.db.patrons = {};

        // console.log('fetch users as normal');

        this.guild.members.forEach((member) => {

          // add yearly role to new members
          if (member.roles.has(rolePatron.id) && !member.roles.has(roleYearly.id)) {
            member.addRole(roleYearly).catch((err) => console.error(PREFIX_LOG_ERROR + err));
          }

          if (member.roles.has(rolePatron.id)) {
            this.addUser('patrons', {
              id: member.id,
              nickname: member.displayName
            });
          }

          if (member.roles.has(roleYearly.id)) {
            this.addUser('discordYearlySubs', {
              id: member.id,
              nickname: member.displayName
            });
          }
        });

        dbModel.writeData(this.db);
      });

    }
  },

  /**
   * Check if it's a new year
   *
   * @returns {boolean}
   */
  isNewYear() {
    return this.db.currentYear !== new Date().getFullYear();
  },

  /**
   * Add user to db list
   *
   * @param list
   * @param user
   */
  addUser(list, user) {
    if (!this.db[list][user.id]) {
      this.db[list][user.id] = user;
    }
  }
};
