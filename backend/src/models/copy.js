import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Copy = sequelize.define('Copy', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ISBN_13: {
      type: DataTypes.STRING(13),
      allowNull: false,
      references: {
        model: 'books',
        key: 'ISBN_13',
      },
      onDelete: 'CASCADE',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'available',
    },
  }, {
    tableName: 'copies',
    timestamps: false,
  });

  return Copy;
}
