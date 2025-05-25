const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database_config');

class Order extends Model {}
Order.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  copy_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'copies', key: 'id' },
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
  },
  status: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  timestamps: false,
});

module.exports = Order