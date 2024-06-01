// models/associations.js
import Store from './store.js';
import Product from './product.js';
import PurchaseHistory from './purchaseHistory.js';

Product.hasMany(PurchaseHistory, { as: 'purchases', foreignKey: 'product_id' });
PurchaseHistory.belongsTo(Product, { as: 'product', foreignKey: 'product_id' });

Store.hasMany(Product, {
  foreignKey: 'store_id',
  as: 'products'
});

Product.belongsTo(Store, {
  foreignKey: 'store_id',
  as: 'store'
});