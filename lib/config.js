const envType = require('get-env')();
require('dotenv').config();
const constants = require('./constants');

const { env } = process;

const config = {
  google: {
    default: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      analyticsId: env.GOOGLE_ANALYTICS_ID,
    },
  },
  outlook: {
    default: {
      clientId: env.OUTLOOK_CLIENT_ID,
      clientSecret: env.OUTLOOK_CLIENT_SECRET,
    },
  },
  session: {
    default: {
      secret: 'test_session',
      resave: false,
      saveUninitialized: false,
    },
    [constants.PROD]: {
      secret: env.SESSION_SECRET,
    },
  },
  database: {
    default: {
      filename: './db/dev.db',
    },
    [constants.PROD]: {
      filename: './db/prod.db',
    },
  },
};

const conf = {
  env: envType,
};
Object.entries(config).map((value) => {
  conf[value[0]] = Object.assign({}, value[1].default, value[1][envType]);
});

module.exports = conf;
