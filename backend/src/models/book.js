import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Book = sequelize.define('Book', {
    ISBN_13: {
      type: DataTypes.STRING(13),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'books',
    timestamps: false,
  });

  return Book;
}
