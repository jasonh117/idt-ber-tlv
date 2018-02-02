const express = require('express');
const lib = require('../lib');
const router = express.Router();

router.get('/', (req, res, next) => {
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
