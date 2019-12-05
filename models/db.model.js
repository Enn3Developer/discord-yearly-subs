const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('storage/db.json');
const db = low(adapter);

module.exports = {
  /**
   * Load database from storage/db.json
   *
   * @returns {*}
   */
  readData() {
    // write default db values if file is empty
    db.defaults({
      currentYear: new Date().getFullYear(),
      discordYearlySubs: {},
      patrons: {}
    }).write();

    // return db values
    return db.value();
  },

  /**
   * Update database
   *
   * @param data
   */
  writeData(data) {
    db.set(data).write();
  }
};
