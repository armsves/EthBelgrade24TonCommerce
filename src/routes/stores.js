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

router.post('/:id/toggle-active', async (req, res) => {
    try {
      const { id } = req.params;
      const store = await Store.findByPk(id);
  
      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }
  
      store.active = !store.active;
      await store.save();
  
      res.json(store);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get('/wallet/:wallet', async (req, res) => {
    try {
      const { wallet } = req.params;
      const store = await Store.findOne({ owner_address: wallet });
  
      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }
  
      res.json(store);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const stores = await Store.findAll({
        where: {
          active: true,
        },
      });
  
      if (!stores.length) {
        return res.status(404).json({ error: 'No active stores found' });
      }
  
      res.json(stores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const store = await Store.findByPk(id);
  
      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }
  
      res.json(store);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;