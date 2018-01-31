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
    user: req.user,
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
    user: req.user,
    tag,
    search: req.query.data || '',
    warning: `The tag ${tag} does not exist`
  });
})
.get((req, res, next) => {
  const tlv = lib.tlv.toPrint(res.locals.tlv);
  res.render('requestTLV', {
    title: `ID TECH TLV: ${tlv.tag}`,
    user: req.user,
    tlv,
    search: req.query.data || '',
    isAdmin: res.locals.isAdmin
  });
  res.json();
});

module.exports = router;
