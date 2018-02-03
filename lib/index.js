const Database = require('better-sqlite3');
const config = require('./config');

const db = new Database(config.database.filename);
const res = db.prepare('SELECT count(*) as count from tlv').get();
if (res.count <= 0) {
  const insert = db.prepare('INSERT INTO tlv (tag, createdAt, modifiedAt) VALUES ($tag, $createdAt, $modifiedAt)');
  const currDatetime = Date.now();
  for (let i = 0xE1; i <= 0xEF; i += 1) {
    for (let j = 0x01; j <= 0x7F; j += 1) {
      insert.run({
        tag: Buffer.from([0xDF, i, j]),
        createdAt: currDatetime,
        modifiedAt: currDatetime,
      });
    }
  }
  for (let i = 0x01; i <= 0x7F; i += 1) {
    insert.run({
      tag: Buffer.from([0xFF, 0xEE, i]),
      createdAt: currDatetime,
      modifiedAt: currDatetime,
    });
  }
}
db.close();

module.exports = require('require-all')(__dirname);
