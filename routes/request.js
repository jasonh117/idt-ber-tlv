const express = require('express');
const lib = require('../lib');

const router = express.Router();

router.use(lib.auth.isUser);

router.get('/', (req, res, next) => {
  const tlvs = lib.tlv.search(req.query.data, 1);
  tlvs.map(tlv => lib.tlv.toList(tlv));
  res.render('request', {
    title: 'ID TECH TLV',
    user: req.user,
    tlvs,
    search: req.query.data || '',
    filter: req.query.filter,
  });
});

router.get('/new/primitive', (req, res, next) => {
  res.redirect(`/request/tlv/${lib.tlv.getNewPrimitive()}`);
});

router.get('/new/constructed', (req, res, next) => {
  res.redirect(`/request/tlv/${lib.tlv.getNewConstructed()}`);
});

router.route('/tlv/:tag')
  .all((req, res, next) => {
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
      warning: `The tag ${tag} does not exist`,
    });
  })
  .get((req, res, next) => {
    const tlv = lib.tlv.toPrint(res.locals.tlv);
    res.render('requestTLV', {
      title: `ID TECH TLV: ${tlv.tag}`,
      user: req.user,
      tlv,
      search: req.query.data || '',
      isAdmin: true, // TODO: res.user.isAdmin
    });
    res.json();
  });

module.exports = router;
