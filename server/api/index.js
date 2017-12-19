const router = require('express').Router();

router.use('/scores', require('./scores.js'));
router.use('/companies', require('./companies.js'));

module.exports = router;
