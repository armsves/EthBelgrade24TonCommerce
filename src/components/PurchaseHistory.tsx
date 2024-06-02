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
    }

    const fetchPurchases = async (): Promise<Purchase[]> => {
        try {
            const response = await fetch(`${process.env.NGROK_URL}/purchase-history/${wallet}`, {
                method: "GET",
                headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                }),
            });
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

    return (
        <FlexBoxCol>
            <h1>Purchase History</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {purchases.map((purchase) => (
                    <Card key={purchase.id} style={{ flex: '0 1 calc(25% - 1em)', margin: '0.5em' }}>
                        <h2>Product ID: {purchase.product_id}</h2>
                        <img src={`/EthBelgrade24TonCommerce/${purchase.image}`} height="100px" alt={purchase.product_name} />
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
