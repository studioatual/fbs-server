import config from '../config/database';

const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

class Database {
  async getConnection() {
    const connection = await oracledb.getConnection({
      user: config.username,
      password: config.password,
      connectString: `${config.host}/${config.database}`,
    });
    return connection;
  }
}

export default new Database();
