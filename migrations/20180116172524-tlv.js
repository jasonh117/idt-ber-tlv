'use strict';

let dbm;
let type;
let seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('tlv', {
    tag: { type: 'blob', primaryKey: true },
    name: { type: 'string' },
    format: { type: 'string' },
    length: { type: 'string' },
    description: { type: 'string' },
    comments: { type: 'string' },
    defaultValue: { type: 'string' },
    detailed: { type: 'string' },
    tagOwner: { type: 'string' },
    isPublic: { type: 'boolean' },
    createdAt: { type: 'datetime', defaultValue: Date.now() },
    modifiedAt: { type: 'datetime', defaultValue: Date.now() },
    timesRequested: { type: 'int', defaultValue: 0 },
    exist: { type: 'boolean', defaultValue: 0 }
  });
};

exports.down = function (db) {
  return db.dropTable('tlv');
};

exports._meta = {
  "version": 1
};