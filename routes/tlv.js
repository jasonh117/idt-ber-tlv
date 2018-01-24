const express = require('express');
const nconf = require('nconf');
const ua = require('universal-analytics');
const lib = require('../lib');
const router = express.Router();
nconf.argv().env();
const analyticsID = nconf.get('GOOGLE_ANALYTICS_ID');

router.route('/:tag')
.all((req, res, next) => {
  const visitor = ua(analyticsID);
  visitor.pageview(req.originalUrl).send();
  const tag = req.params.tag.trim().toUpperCase();
  if (lib.tlv.isBytes.test(tag)) {
    const tlv = lib.tlv.getOne(tag);
    if (tlv) {
      res.locals.tlv = tlv;
      next();
      return;
    }
  }
  res.render('warning', {
    title: 'ID TECH TLV: Not Found',
    tag,
    search: req.query.data || '',
    warning: `The tag ${tag} does not exist`
  });
})
.get((req, res, next) => {
  const tlv = lib.tlv.toPrint(res.locals.tlv);
  res.render('tlv', {
    title: `ID TECH TLV: ${tlv.tag}`,
    tlv,
    search: req.query.data || ''
  });
  res.json();
});

module.exports = router;
