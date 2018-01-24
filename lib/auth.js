const error = require('./error');

exports.isUser = (req, res, next) => {
    // TODO: add logic for how to authenticate user
    if (true) { // eslint-disable-line
        res.locals.isAdmin = true;
        return next();
    }
    res.render('warning', {
        title: 'ID TECH TLV: Not Logged In',
        search: req.query.data || '',
        warning: 'Log in to access page.'
    });
};

exports.isUserApi = (req, res, next) => {
    // TODO: add logic for how to authenticate user
    if (true) { // eslint-disable-line
        res.locals.isAdmin = true;
        return next();
    }
    throw error(401, `Not logged in.`);
};

exports.isAdminApi = (req, res, next) => {
    // TODO: add logic for how to authenticate admin
    if (true) { // eslint-disable-line
        return next();
    } else if (true) { // eslint-disable-line
        throw error(401, `User is not an admin.`);
    }
    throw error(401, `Not logged in.`);
};
