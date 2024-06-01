// routes/purchaseHistory.js

import express from 'express';
import PurchaseHistory from '../models/purchaseHistory.js';
import Product from '../models/product.js';
import Store from '../models/store.js';

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const { product_id, buyer_address, qty, price, status, confirmation } = req.body;
        const Purchase = await PurchaseHistory.create({
            product_id,
            buyer_address,
            qty,
            price,
            status,
            confirmation
        });
        res.status(201).json(Purchase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:walletAddress', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const purchases = await PurchaseHistory.findAll({ 
            where: { buyer_address: walletAddress },
            include: [{
                model: Product,
                as: 'product',
                attributes: ['name', 'image']
            }]
        });
        
        // Map over the purchases to extract the product names
        const purchasesWithProductNames = purchases.map(purchase => ({
            ...purchase.get(),
            product_name: purchase.product.name,
            image: purchase.product.image,
        }));

        res.status(200).json(purchasesWithProductNames);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/sales/:walletAddress', async (req, res) => {
    try {
        const walletAddress = req.params.walletAddress;
        const purchases = await PurchaseHistory.findAll({ 
            include: [{
                model: Product,
                as: 'product',
                attributes: ['name', 'image'],
                include: [{
                    model: Store,
                    as: 'store',
                    where: { owner_address: walletAddress },
                    attributes: ['id', 'name']
                }]
            }]
        });

        res.json(purchases);
    } catch (error) {
        console.error('Failed to fetch sales:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;