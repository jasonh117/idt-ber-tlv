const express = require('express');
const lib = require('../lib');

const router = express.Router();

router.get('/tlv', (req, res, next) => {
  const tlvs = lib.tlv.search(req.query.data, 2);
  tlvs.map(tlv => lib.tlv.toJSON(tlv));
  res.json(tlvs);
});

router.get('/tlv/all', (req, res, next) => {
  const tlvs = lib.tlv.search(req.query.data);
  tlvs.map(tlv => lib.tlv.toJSON(tlv));
  res.json(tlvs);
});

router.route('/tlv/:tag')
  .all((req, res, next) => {
    if (!lib.tlv.isBytes.test(req.params.tag.trim())) {
      throw lib.error(400, `Tag '${req.params.tag.trim()}' is not valid.`);
    }
    const tlv = lib.tlv.getOne(req.params.tag);
    if (!tlv) {
      throw lib.error(400, `Tag '${req.params.tag.trim()}' is not valid.`);
    }
    res.locals.tlv = tlv;
    next();
  })
  .get((req, res, next) => {
    res.json(lib.tlv.toJSON(res.locals.tlv));
  })
  .post(lib.auth.isAdminApi, (req, res, next) => {
    const update = Object.assign({}, req.body);
    update.tag = req.params.tag;
    update.isPublic = req.body.isPublic ? 1 : 0;
    lib.tlv.add(update);
    res.json(lib.tlv.toJSON(lib.tlv.getOne(req.params.tag)));
  })
  .delete(lib.auth.isAdminApi, (req, res, next) => {
    lib.tlv.remove(req.params.tag);
    res.end();
  });

router.get('/request/tlv', (req, res, next) => {
  const tlvs = lib.tlv.search(req.query.data, 1);
  tlvs.map(tlv => lib.tlv.toJSON(tlv));
  res.json(tlvs);
});

router.route('/request/tlv/:tag')
  .all((req, res, next) => {
    if (!lib.tlv.isBytes.test(req.params.tag.trim())) {
      throw lib.error(400, `Tag '${req.params.tag.trim()}' is not valid.`);
    }
    const tlv = lib.tlv.getOne(req.params.tag);
    if (!tlv) {
      throw lib.error(400, `Tag '${req.params.tag.trim()}' is not valid.`);
    }
    res.locals.tlv = tlv;
    next();
  })
  .get((req, res, next) => {
    res.json(lib.tlv.toJSON(res.locals.tlv));
  })
  .post(lib.auth.isUserApi, (req, res, next) => {
    const update = Object.assign({}, req.body);
    update.tag = req.params.tag;
    update.isPublic = req.body.isPublic ? 1 : 0;
    lib.tlv.request(update);
    res.json(lib.tlv.toJSON(lib.tlv.getOne(req.params.tag)));
  })
  .delete(lib.auth.isUserApi, (req, res, next) => {
    lib.tlv.remove(req.params.tag);
    res.end();
  });

router.get('/request/new', (req, res, next) => {
  res.json({
    primitive: lib.tlv.getNewPrimitive(),
    constructed: lib.tlv.getNewConstructed(),
  });
});

router.use((err, req, res) => {
  const status = err.status || 500;
  res.status(status).json({
    status,
    message: err.toString(),
  });
});

module.exports = router;
