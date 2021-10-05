'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {foreignKey: "userId"})
      this.belongsTo(models.product, {foreignKey: "productId"})
    }
  };
  order.init({
    invoiceno: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allownull: false,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
    total: {
      type: DataTypes.INTEGER,
    },
    shippingAddress: {
      type: DataTypes.STRING,
      allownull: false
    },
    pincode: {
      type: DataTypes.INTEGER,
      allownull: false
    },
    payment: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    status: {
      type: DataTypes.ENUM("ordered","dispatched","delivered"),
      defaultValue: "ordered",
    }
  }, {
    sequelize,
    freezeTableName: true,
    tableName: 'order',
  });
  return order;
};