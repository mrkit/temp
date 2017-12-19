const Companies = require('../Companies'),
  Scores = require('../Scores'),
  conn = require('../conn'),
  companiesData = require('./companies.json'),
  scoreData = require('./score-records.json');

const seed = () => {
  for (let i = 0, n = scoreData.length; i < n; i++) {
    Scores.create({
      candidate_id: scoreData[i].candidate_id,
      communication_score: scoreData[i].communication_score,
      coding_score: scoreData[i].coding_score,
      title: scoreData[i].title,
      company_id: scoreData[i].company_id
    });
  }

  for (let i = 0, n = companiesData.length; i < n; i++) {
    Companies.create({ company_id: companiesData[i].company_id, fractal_index: companiesData[i].fractal_index });
  }
};

module.exports = seed;
