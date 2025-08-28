import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Borrow = sequelize.define('Borrow', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    copyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'copies',
        key: 'id',
      },
    },
    borrowedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    returnedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'borrows',
    timestamps: false,
  });

  return Borrow;
};
