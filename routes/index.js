const express = require('express');
const nconf = require('nconf');
const ua = require('universal-analytics');
const lib = require('../lib');
const router = express.Router();
nconf.argv().env();
const analyticsID = nconf.get('GOOGLE_ANALYTICS_ID');

router.get('/', (req, res, next) => {
  const visitor = ua(analyticsID);
  visitor.pageview(req.originalUrl).send();
  const tlvs = lib.tlv.search(req.query.data, 2);
  tlvs.map(tlv => lib.tlv.toList(tlv));
  res.render('index', {
    title: 'ID TECH TLV',
    user: req.user,
    tlvs,
    search: req.query.data || '',
    filter: req.query.filter
  });
});

module.exports = router;
