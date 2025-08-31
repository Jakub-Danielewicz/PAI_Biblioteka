import { DataTypes } from 'sequelize';

export default function favoriteModel(sequelize) {
  const Favorite = sequelize.define('Favorite', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    bookId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Books',
        key: 'ISBN_13',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'Favorites',
    timestamps: true,
    updatedAt: false, // Only track when favorite was added, not updated
    indexes: [
      {
        unique: true,
        fields: ['userId', 'bookId'], // Prevent duplicate favorites
      },
    ],
  });

  return Favorite;
}