const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database_config');

class Book extends Model {}
Book.init({
  ISBN_13: {
    type: DataTypes.BIGINT,
    primaryKey: true
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Publisher: {
    type: DataTypes.STRING,
  },
  Release_Date: {
    type: DataTypes.DATEONLY,
  },
}, {
  sequelize,
  modelName: 'Book',
  tableName: 'books',
  timestamps: false,
});

module.exports = Book;