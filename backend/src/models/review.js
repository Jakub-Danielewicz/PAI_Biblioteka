import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import { User } from "./user.js";
import { Book } from "./book.js";

export default function(sequelize) => {
  const sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, { 
    tableName: 'reviews',
    timestamps: false,
  });
  return Book;
}

