// models/purchaseHistory.js

import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import Product from './product.js';

const PurchaseHistory = sequelize.define('PurchaseHistory', {
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id'
    }
  },
  buyer_address: DataTypes.STRING,
  qty: DataTypes.INTEGER,
  price: DataTypes.FLOAT,
  status: DataTypes.STRING
});

export default PurchaseHistory;