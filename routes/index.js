const express = require('express');
const tlv = require('../lib/tlv');
const router = express.Router();

router.get('/', function(req, res, next) {
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
  res.render('index', {
    title: 'ID TECH TLV',
    tlvs: tlv.search(req.query.data, req.query.data ? null : exist),
    search: req.query.data || '',
    filter: req.query.filter
  });
});

module.exports = router;
