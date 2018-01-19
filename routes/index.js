const express = require('express');
const nconf = require('nconf');
const ua = require('universal-analytics');
const tlvLib = require('../lib/tlv');
const router = express.Router();
nconf.argv().env();
const analyticsID = nconf.get('GOOGLE_ANALYTICS_ID');

router.get('/', (req, res, next) => {
  const visitor = ua(analyticsID);
  visitor.pageview(req.originalUrl).send();
  let exist = 1;
  switch (req.query.filter) {
    case 'all':
      exist = null;
      break;
    case 'empty':
      exist = 0;
      break;
    case 'existing':
    default:
      exist = 1;
  }
  const tlvs = tlvLib.search(req.query.data, req.query.data ? null : exist);
  tlvs.map(tlv => tlvLib.toJSON(tlv));
  res.render('index', {
    title: 'ID TECH TLV',
    tlvs,
    search: req.query.data || '',
    filter: req.query.filter
  });
});

module.exports = router;
