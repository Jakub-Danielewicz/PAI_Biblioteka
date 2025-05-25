const { Sequelize } = require('sequelize');

const sequelize_db = new Sequelize({
    dialect: 'sqlite',
    storage: './db/database.sqlite' 
  });

module.exports = sequelize_db;