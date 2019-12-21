const dbModel = require('../models/db_model');

module.exports = {
  /**
   * Stats API: discord yearly subs + patrons
   *
   * @param req
   * @param res
   * @returns {*}
   */
  statsInfo(req, res) {
    const dbData = dbModel.readData();

    const data = {
      discordYearlySubs: Object.values(dbData.discordYearlySubs).map((user) => {
        return user.nickname
      }),
      patrons: Object.values(dbData.patrons).map((user) => {
        return user.nickname
      })
    };

    return res.json({ success: true, data });
  }
};
