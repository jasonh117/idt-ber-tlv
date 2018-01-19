const express = require('express');
const nconf = require('nconf');
const ua = require('universal-analytics');
const moment = require('moment-timezone');
const tlvLib = require('../lib/tlv');
const router = express.Router();
nconf.argv().env();
const analyticsID = nconf.get('GOOGLE_ANALYTICS_ID');
const visitor = ua(analyticsID);

const isBytes = /^[0-9A-Fa-f]{2,}$/;

router.route('/:tag')
.all((req, res, next) => {
  visitor.pageview(req.originalUrl).send();
  if (isBytes.test(req.params.tag.trim())) {
    const tlv = tlvLib.getOne(req.params.tag);
    if (tlv) {
      res.locals.tlv = tlv;
      next();
      return;
    }
  }
  res.render('notlv', {
    title: 'ID TECH TLV: Not Found',
    tag: req.params.tag.toUpperCase(),
    search: req.query.data || ''
  });
})
.get((req, res, next) => {
  const tlv = tlvLib.toJSON(res.locals.tlv);
  tlv.modifiedAt = moment(tlv.modifiedAt, 'x').tz('UTC').format('lll z');
  res.render('tlv', {
    title: `ID TECH TLV: ${req.params.tag.toUpperCase()}`,
    tlv,
    search: req.query.data || ''
  });
  res.json();
})
.post((req, res, next) => {
  const update = Object.assign({}, req.body);
  update.tag = req.params.tag;
  update.isPublic = req.body.isPublic ? 1 : 0;
  tlvLib.add(update);
  res.redirect(`/tlv/${req.params.tag}`);
});

module.exports = router;
