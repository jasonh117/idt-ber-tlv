const express = require('express');
const nconf = require('nconf');
const ua = require('universal-analytics');
const tlvLib = require('../lib/tlv');
const error = require('../lib/error');
const router = express.Router();
nconf.argv().env();
const analyticsID = nconf.get('GOOGLE_ANALYTICS_ID');

const isBytes = /^[0-9A-Fa-f]{2,}$/;

router.get('/tlv/', (req, res, next) => {
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
  res.json(tlvs);
});

router.route('/tlv/:tag')
.all((req, res, next) => {
  const visitor = ua(analyticsID);
  visitor.pageview(req.originalUrl).send();
  if (!isBytes.test(req.params.tag.trim()))
    throw error(400, `Tag '${req.params.tag.trim()}' is not valid.`);
  const tlv = tlvLib.getOne(req.params.tag);
  if (!tlv)
    throw error(400, `Tag '${req.params.tag.trim()}' is not valid.`);
  res.locals.tlv = tlv;
  next();
})
.get((req, res, next) => {
  res.json(tlvLib.toJSON(res.locals.tlv));
})
.post((req, res, next) => {
  const update = Object.assign({}, req.body);
  update.tag = req.params.tag;
  update.isPublic = req.body.isPublic ? 1 : 0;
  tlvLib.add(update);
  res.json(tlvLib.toJSON(tlvLib.getOne(req.params.tag)));
})
.delete((req, res, next) => {
  tlvLib.remove(req.params.tag);
  res.end();
});

router.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ status, message: err.toString() });
});

module.exports = router;
