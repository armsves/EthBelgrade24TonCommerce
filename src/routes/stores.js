// routes/stores.js

import express from 'express';
import Store from '../models/store.js';

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { name, description, owner_address, image } = req.body;
    const store = await Store.create({
      name,
      description,
      owner_address,
      image,
      active: 1
    });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/wallet/:wallet', async (req, res) => {
    try {
      const { wallet } = req.params;
      console.log(wallet);
      const store = await Store.findOne({ owner_address: wallet });
  
      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }
  
      res.json(store);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;