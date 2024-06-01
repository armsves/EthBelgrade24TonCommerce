import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Store = sequelize.define('Store', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  owner_address: DataTypes.STRING,
  image: DataTypes.STRING,
  description: DataTypes.STRING,
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});


export default Store;