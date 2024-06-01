import React, { useEffect, useState } from 'react';
import { Card, FlexBoxCol, FlexBoxRow, Button, Input } from "./styled/styled";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useTonConnect } from "../hooks/useTonConnect";

export function PurchaseHistory() {
    const [tonConnectUI] = useTonConnectUI();
    const { wallet } = useTonConnect();
    const [purchases, setPurchases] = useState<Purchase[]>([]);

    interface Purchase {
        id: string;
        product_id: string;
        product_name: string;
        image: string;
        qty: number;
        price: number;
        createdAt: string;
        // add other properties here as needed
    }

    const fetchPurchases = async (): Promise<Purchase[]> => {
        try {
            const response = await fetch(`http://localhost:3000/purchase-history/${wallet}`);
            const data: Purchase[] = await response.json();
            console.log('data: ', data);
            return data;
        } catch (error) {
            console.error('Failed to fetch purchases:', error);
            return [];
        }
    };

    useEffect(() => {
        fetchPurchases().then(setPurchases);
    }, []);

    // Render the purchases
    return (
        <FlexBoxCol>
            <h1>Purchase History</h1>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between'
            }}>
                {purchases.map((purchase) => (
                    <Card key={purchase.id} style={{
                        flex: '0 1 calc(25% - 1em)',
                        margin: '0.5em'
                    }}>
                        <h2>Product ID: {purchase.product_id}</h2>
                        <img src={`${purchase.image}`} height="100px" alt={purchase.product_name} />
                        <p>Product Name: {purchase.product_name}</p>
                        <p>Quantity: {purchase.qty}</p>
                        <p>Price: {purchase.price}</p>
                        <p>Purchase Date: {purchase.createdAt}</p>
                    </Card>
                ))}
            </div>
        </FlexBoxCol>
    );
};
