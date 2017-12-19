const conn = require('./conn'),
  Sequelize = conn.Sequelize;

const Companies = conn.define('company', {
  company_id: Sequelize.INTEGER,
  fractal_index: Sequelize.DECIMAL(10, 3)
});

module.exports = Companies;
