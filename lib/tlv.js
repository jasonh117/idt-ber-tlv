const Database = require('better-sqlite3');
const db = new Database('./db/dev.db');

const editableFields = ['name', 'format', 'length', 'description', 'comments', 'defaultValue', 'detailed', 'tagOwner', 'isPublic'];
const searchableFields = ['hex(tag)', 'name', 'format', 'length', 'description', 'comments', 'defaultValue', 'detailed', 'tagOwner'];

// Making sure all tags given to sqlite3 is in byte string form
const getTagString = tag => {
    const tagStr = (typeof tag === 'string') ? Buffer.from(tag, 'hex') : tag;
    return tagStr.toString('hex');
}

exports.toJSON = tlv => {
    tlv.tag = tlv.tag.toString('hex').toUpperCase();
    return tlv;
}

exports.getOne = (tag) => {
    if (!tag) return null;
    const update = `
        UPDATE tlv
        SET timesRequested = timesRequested + 1
        WHERE tag = x'${getTagString(tag)}'
    `;
    db.prepare(update).run();
    const query = `SELECT * FROM tlv WHERE tag = x'${getTagString(tag)}'`;
    return db.prepare(query).get();
}

exports.get = (exist) => {
    let query = `SELECT * FROM tlv`;
    if (exist !== null)
    {
        if (exist <= 0)
            query += ` WHERE exist <= 0`;
        else if (exist > 0)
            query += ` WHERE exist > 0`;
    }
    return db.prepare(query).all();
}

exports.search = (search, exist) => {
    if (!search) return exports.get(exist);
    let query = `SELECT * FROM tlv WHERE (`;
    searchableFields.map(field => {
        query += `${field} LIKE '%${search}%' OR `;
    });
    query = query.replace(/ OR $/, ")");
    if (exist != null)
    {
        if (exist <= 0)
            query += ` AND exist <= 0`;
        else if (exist > 0)
            query += ` AND exist > 0`;
    }
    return db.prepare(query).all();
}

exports.add = (tlv) => {
    if (!tlv || !tlv.tag) return null;
    let update = 'UPDATE tlv SET ';
    for (const key in tlv) {
        if (editableFields.includes(key))
            update += `${key} = '${tlv[key]}', `;
    }
    update += `modifiedAt = ${Date.now()}, `;
    update += `exist = 1 `;
    update += `WHERE tag = x'${getTagString(tlv.tag)}'`;
    return db.prepare(update).run().changes;
}

exports.remove = (tag) => {
    if (!tag) return null;
    let update = 'UPDATE tlv SET ';
    editableFields.map(field => {
        update += `${field} = null, `;
    });
    update += `modifiedAt = ${Date.now()}, `;
    // update += `timesRequested = 0, `; // Uncomment to reset request times
    update += `exist = 0 `;
    update += `WHERE tag = x'${getTagString(tag)}'`;
    return db.prepare(update).run().changes;
}
