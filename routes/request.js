const express = require('express');
const nconf = require('nconf');
const ua = require('universal-analytics');
const lib = require('../lib');
const router = express.Router();
nconf.argv().env();
const analyticsID = nconf.get('GOOGLE_ANALYTICS_ID');

router.use(lib.auth.isUser);

router.get('/', (req, res, next) => {
  const visitor = ua(analyticsID);
  visitor.pageview(req.originalUrl).send();
  const tlvs = lib.tlv.search(req.query.data, 1);
  tlvs.map(tlv => lib.tlv.toList(tlv));
  res.render('request', {
    title: 'ID TECH TLV',
    tlvs,
    search: req.query.data || '',
    filter: req.query.filter
  });
});

router.get('/new/primitive', (req, res, next) => {
  const visitor = ua(analyticsID);
  visitor.pageview(req.originalUrl).send();
  res.redirect(`/request/tlv/${lib.tlv.getNewPrimitive()}`);
});

router.get('/new/constructed', (req, res, next) => {
  const visitor = ua(analyticsID);
  visitor.pageview(req.originalUrl).send();
  res.redirect(`/request/tlv/${lib.tlv.getNewConstructed()}`);
});

router.route('/tlv/:tag')
.all((req, res, next) => {
  const visitor = ua(analyticsID);
  visitor.pageview(req.originalUrl).send();
  if (lib.tlv.isBytes.test(req.params.tag.trim())) {
    const tlv = lib.tlv.getOne(req.params.tag);
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
  const tlv = lib.tlv.toPrint(res.locals.tlv);
  res.render('requestTLV', {
    title: `ID TECH TLV: ${req.params.tag.toUpperCase()}`,
    tlv,
    search: req.query.data || ''
  });
  res.json();
});

module.exports = router;
