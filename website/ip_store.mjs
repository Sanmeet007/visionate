import sqlite3 from "sqlite3";

/**
 * @typedef ClientDetails
 * @prop {string} ip
 * @prop {string} countryCode
 * @prop {string} countryName
 * @prop {string} regionCode
 * @prop {string} regionName
 * @prop {string} city
 * @prop {string} postalCode
 * @prop {string} latitude
 * @prop {string} longitude
 */

class UserIpDataStore {
  db = new sqlite3.Database(".requests_data/db.sqlite");
  #table_name = "ip_store";

  constructor() {
    // CREATE TABLE IF NOT PRESENT
    this.db.exec(`
    CREATE TABLE IF NOT EXISTS ${this.#table_name}(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT,
        country_code TEXT,
        country_name TEXT,
        region_code TEXT,
        region_name TEXT,
        city TEXT,
        postal_code TEXT,
        latitude TEXT,
        longitude TEXT,
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `);

    this.db.exec(`
    CREATE TABLE IF NOT EXISTS blacklisted_ips(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT,
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `);
  }

  /**
   * Registers new ip
   *
   * @param {String} clientIP
   * @param {ClientDetails} clientDetails
   */
  async registerClient(clientIP, clientDetails) {
    try {
      const isRegisted = await this.hasIp(clientIP);
      if (!isRegisted) {
        this.add(clientDetails);
      } else return;
    } catch (e) {}
  }

  /**
   * Check if ip is registered in store or not
   *
   * @param {string} ip
   * @returns
   */
  async hasIp(ip) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM ${this.#table_name} WHERE ip='${ip}'`,
        (err, row) => {
          if (!err) {
            return resolve(Boolean(row));
          } else return reject(err);
        }
      );
    });
  }

  /**
   *
   * @param {ClientDetails} data
   */
  add(data) {
    const {
      ip = null,
      countryCode = null,
      countryName = null,
      regionCode = null,
      regionName = null,
      city = null,
      postalCode = null,
      latitude = null,
      longitude = null,
    } = data;

    this.db.exec(
      `INSERT INTO ${
        this.#table_name
      }(ip, country_code, country_name, region_code, region_name , city, postal_code, latitude, longitude) VALUES("${ip}","${countryCode}" ,"${countryName}" ,"${regionCode}"  , "${regionName}" ,"${city}","${postalCode}" ,"${latitude}" ,"${longitude}")`
    );
  }

  blacklistIp(ip) {
    this.db.exec(`INSERT INTO blacklisted_ips(ip) values('${ip}')`);
  }

  whitelistIp(ip) {
    this.db.exec(`DELETE FROM  blacklisted_ips WHERE ip = '${ip}'`);
  }

  getBlackListedIps() {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM  blacklisted_ips`, (err, rows) => {
        if (!err) {
          return resolve(rows?.map((x) => x.ip) || []);
        } else return reject(err);
      });
    });
  }
}

const ipStore = new UserIpDataStore();

export default ipStore;
