const express = require('express');
const tlvLib = require('../lib/tlv');
const router = express.Router();

router.get('/:tag', function(req, res, next) {
  try {
    const tlv = tlvLib.getOne(req.params.tag);
    res.render('tlv', {
      title: `ID TECH TLV: ${req.params.tag.toUpperCase()}`,
      tlv,
      search: req.query.data || ''
    });
  } catch (err) {
    res.render('notlv', {
      title: 'ID TECH TLV: Not Found',
      tag: req.params.tag.toUpperCase(),
      search: req.query.data || ''
    });
  }
});

router.post('/:tag', function(req, res, next) {
  const update = Object.assign({}, req.body);
  update.tag = req.params.tag;
  update.isPublic = req.body.isPublic ? 1 : 0;
  tlvLib.add([update]);
  res.redirect(`/tlv/${req.params.tag}`);
});

router.delete('/:tag', function(req, res, next) {
  tlvLib.remove([req.params.tag]);
  res.redirect(`/tlv/${req.params.tag}`);
});

module.exports = router;
