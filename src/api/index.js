import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import sequelize from './database.js'; // Import sequelize
import storeRoutes from './routes/stores.js'; // Import store routes
import productRoutes from './routes/products.js'; // Import product routes
import purchaseHistoryRoutes from './routes/purchaseHistory.js'; // Import purchase history routes
import './models/associations.js';

const app = express();

// Enable CORS
app.use(cors());

app.use(express.json());

// Configure multer to use disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage });

// Define a route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    return res.status(200).json({ message: "File uploaded successfully", fileName: req.file.filename });
  } catch (error) {
    console.error(error);
  }
});

// Use the routes
app.use('/stores', storeRoutes);
app.use('/products', productRoutes);
app.use('/purchase-history', purchaseHistoryRoutes);

// Connect to the database and start the server
sequelize.sync()
  .then(() => {
    app.listen(3000, () => console.log('Server started on port 3000'));
  })
  .catch(err => console.log(err));