const Database = require('better-sqlite3');
const moment = require('moment-timezone');
const db = new Database('./db/dev.db');

const fields = ['tag', 'name', 'format', 'length', 'description', 'comments', 'defaultValue', 'detailed', 'tagOwner', 'isPublic', 'createdAt', 'modifiedAt', 'timesRequested', 'status'];
const editableFields = ['name', 'format', 'length', 'description', 'comments', 'defaultValue', 'detailed', 'tagOwner', 'isPublic'];
const searchableFields = ['hex(tag)', 'name', 'format', 'length', 'description', 'comments', 'defaultValue', 'detailed', 'tagOwner'];

// Making sure all tags given to sqlite3 is in byte string form
const getTagString = tag => {
    const tagStr = (typeof tag === 'string') ? Buffer.from(tag, 'hex') : tag;
    return tagStr.toString('hex');
}

const truncate = (str, n, useWordBoundary) => {
    if (!str || str.length <= n)
        return str;
    const subString = str.substr(0, n - 1);
    return `${(useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString)}...`;
};

exports.isBytes = /^[0-9A-Fa-f]{2,}$/;

exports.toJSON = tlv => {
    tlv.tag = tlv.tag.toString('hex').toUpperCase();
    return tlv;
}

exports.toPrint = tlv => {
    tlv.tag = tlv.tag.toString('hex').toUpperCase();
    tlv.createdAt = moment(tlv.createdAt, 'x').tz('UTC').format('lll z');
    tlv.modifiedAt = moment(tlv.modifiedAt, 'x').tz('UTC').format('lll z');
    tlv.isPublic = tlv.isPublic ? 'Yes' : 'No';
    switch (tlv.status) {
        case 2:
            tlv.statusDescription = 'Approved Tag';
            break;
        case 1:
            tlv.statusDescription = 'Pending, waiting for approval';
            break;
        case 0:
        default:
            tlv.statusDescription = 'Empty, avaliable for new tag';
    }
    return tlv;
}

exports.toList = tlv => {
    tlv.tag = tlv.tag.toString('hex').toUpperCase();
    tlv.description = truncate(tlv.description, 35, true);
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

exports.get = (status) => {
    let query = `SELECT * FROM tlv`;
    if (typeof status !== 'undefined')
        query += ` WHERE status = ${status}`;
    return db.prepare(query).all()
        .sort((a, b) => Buffer.compare(a.tag, b.tag));
}

exports.search = (search, status) => {
    if (!search) return exports.get(status);
    let query = `SELECT * FROM tlv WHERE (`;
    searchableFields.map(field => {
        query += `${field} LIKE '%${search}%' OR `;
    });
    query = query.replace(/ OR $/, ")");
    if (typeof status !== 'undefined')
        query += ` AND status = ${status}`;
    return db.prepare(query).all()
        .sort((a, b) => Buffer.compare(a.tag, b.tag));
}

exports.getNewPrimitive = () => {
    const query = `SELECT * FROM tlv where status = 0 AND substr(tag, 1, 1) = x'DF' ORDER BY tag DESC LIMIT 1;`;
    return getTagString(db.prepare(query).get().tag);
}

exports.getNewConstructed = () => {
    const query = `SELECT * FROM tlv where status = 0 AND substr(tag, 1, 2) = x'FFEE' ORDER BY tag ASC LIMIT 1;`;
    return getTagString(db.prepare(query).get().tag);
}

exports.request = tlv => exports.add(tlv, 1);

exports.add = (tlv, status = 2) => {
    if (!tlv || !tlv.tag) return null;
    let update = 'UPDATE tlv SET ';
    for (const key in tlv) {
        if (editableFields.includes(key)) {
            if (typeof tlv[key] === 'string' && tlv[key].trim() != '')
                update += `${key} = '${tlv[key].replace(/'/g, '\'\'')}', `;
            else if (typeof tlv[key] === 'number')
                update += `${key} = '${tlv[key]}', `;
        }
    }
    update += `modifiedAt = ${Date.now()}, `;
    update += `status = ${status} `;
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
    update += `status = 0 `;
    update += `WHERE tag = x'${getTagString(tag)}'`;
    return db.prepare(update).run().changes;
}

// require('./info.json').map(tlv => {
//     exports.add(tlv);
// });
