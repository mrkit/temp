const router = require('express').Router();

const { Scores } = require('../db').models;

router.get('/', (req, res, next) => {
  Scores.findAll()
    .then(scoresData => res.send(scoresData))
    .catch(next);
});

module.exports = router;
