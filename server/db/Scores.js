const conn = require('./conn'),
  Sequelize = conn.Sequelize;

const Scores = conn.define('score', {
  candidate_id: Sequelize.INTEGER,
  communication_score: Sequelize.INTEGER,
  coding_score: Sequelize.INTEGER,
  title: Sequelize.STRING,
  company_id: Sequelize.INTEGER
});

module.exports = Scores;
