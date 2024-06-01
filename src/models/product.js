// models/product.js

import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import Store from './store.js';

const Product = sequelize.define('Product', {
  store_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Store,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: DataTypes.STRING,
  description: DataTypes.STRING,
  price: DataTypes.FLOAT,
  qty: DataTypes.INTEGER,
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

export default Product;