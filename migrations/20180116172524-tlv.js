exports.up = (db) => {
  const sql = `
    CREATE TABLE 'tlv' (
      'tag' BLOB,
      'name' TEXT,
      'format' TEXT,
      'length' TEXT,
      'description' TEXT,
      'comments' TEXT,
      'defaultValue' TEXT,
      'detailed' TEXT,
      'tagOwner' TEXT,
      'isPublic' INTEGER,
      'createdAt' INTEGER,
      'modifiedAt' INTEGER,
      'timesRequested' INTEGER DEFAULT 0,
      'status' INTEGER DEFAULT 0,
      PRIMARY KEY('tag')
    );
  `;
  return db.runSql(sql);
};

exports.down = db => db.dropTable('tlv');
