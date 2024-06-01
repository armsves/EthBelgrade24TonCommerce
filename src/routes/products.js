// routes/products.js

import express from 'express';
import Product from '../models/product.js';

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const { store_id, name, image, description, price, qty, active } = req.body;
        const Products = await Product.create({
            store_id,
            name,
            image,
            description,
            price,
            qty,
            active: 1
        });
        res.status(201).json(Products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/decrease', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.qty > 0) {
            product.qty -= 1;
            await product.save();
        } else {
            return res.status(400).json({ error: 'Product quantity is already 0' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/toggle-active', async (req, res) => {
    try {
        const { id } = req.params;
        const Products = await Product.findByPk(id);

        if (!Products) {
            return res.status(404).json({ error: 'Products not found' });
        }

        Products.active = !Products.active;
        await Products.save();

        res.json(Products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/wallet/:wallet', async (req, res) => {
    try {
        const { wallet } = req.params;
        const Products = await Product.findOne({ owner_address: wallet });

        if (!Products) {
            return res.status(404).json({ error: 'Products not found' });
        }

        res.json(Products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch all products for a specific store
router.get('/stores/:storeId', async (req, res) => {
    try {
        const { storeId } = req.params;
        const products = await Product.findAll({ where: { store_id: storeId } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a specific product
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Product.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(204).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;