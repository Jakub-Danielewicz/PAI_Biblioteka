const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database_config');

class BookCopy extends Model {}
BookCopy.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  book_ISBN: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'books',
      key: 'ISBN_13',
    },
    onDelete: 'CASCADE',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'avalaible',
  },
}, {
  sequelize,
  modelName: 'Copy',
  tableName: 'copies',
  timestamps: false,
});

module.exports = BookCopy
