const conn = require('./conn'),
  Companies = require('./Companies'),
  Scores = require('./Scores'),
  seed = require('./seed');

module.exports = {
  conn,
  seed,
  models: {
    Companies,
    Scores
  }
};
