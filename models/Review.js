const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database_config');

class Review extends Model {}
Review.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  book_ISBN: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'books',
      key: 'ISBN_13',
    },
  },
  rating: {
    type: DataTypes.INTEGER,
  },
  content: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  modelName: 'Review',
  tableName: 'reviews',
  timestamps: false,
});

module.exports = Review