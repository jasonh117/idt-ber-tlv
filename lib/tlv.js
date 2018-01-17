const Database = require('better-sqlite3');
const db = new Database('./db/dev.db');

const editableFields = ['name', 'format', 'length', 'description', 'comments', 'defaultValue', 'detailed', 'tagOwner', 'isPublic'];
const searchableFields = ['hex(tag)', 'name', 'format', 'length', 'description', 'comments', 'defaultValue', 'detailed', 'tagOwner'];

const getTagString = tag => {
    return (typeof tag === 'string') ? tag : tag.toString('hex');
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
    return db.prepare(query).all();
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

exports.add = (tlvs) => {
    if (!tlvs || tlvs.length <= 0) return null;
    tlvs.map(tlv => {
        if (!tlv.tag) return;
        let update = 'UPDATE tlv SET ';
        for (const key in tlv) {
            if (editableFields.includes(key))
                update += `${key} = '${tlv[key]}', `;
        }
        update += `modifiedAt = ${Date.now()}, `;
        update += `exist = 1 `;
        update += `WHERE tag = x'${getTagString(tlv.tag)}'`;
        db.prepare(update).run();
    });
}

exports.remove = (tags) => {
    if (!tags || tags.length <= 0) return null;
    tags.map(tag => {
        let update = 'UPDATE tlv SET ';
        editableFields.map(field => {
            update += `${field} = null, `;
        });
        update += `modifiedAt = ${Date.now()}, `;
        update += `timesRequested = 0, `;
        update += `exist = 1 `;
        update += `WHERE tag = x'${getTagString(tag)}'`;
        db.prepare(update).run();
    });
}
