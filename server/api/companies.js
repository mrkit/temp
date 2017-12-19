const router = require('express').Router();
const { Companies } = require('../db').models;

router.get('/', (req, res, next) => {
  Companies.findAll()
    .then(companiesData => res.send(companiesData))
    .catch(next);
});

module.exports = router;
