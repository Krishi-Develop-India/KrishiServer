const router = require('express').Router();
const adminbro  = require('./adminbro');

router.use('/', adminbro);

module.exports  = router;