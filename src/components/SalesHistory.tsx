import React, { useEffect, useState } from 'react';
import { Card, FlexBoxCol, FlexBoxRow, Button, Input } from "./styled/styled";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useTonConnect } from "../hooks/useTonConnect";

export function SalesHistory() {
    const [tonConnectUI] = useTonConnectUI();
    const { wallet } = useTonConnect();
    const [sales, setSales] = useState<Sale[]>([]);

    interface Sale {
        id: string;
        product_id: string;
        buyer_address: string;
        confirmation: string;
        product_name: string;
        product: {
            image: string;
        }
        qty: number;
        price: number;
        createdAt: string;
    }

    const fetchSales = async (): Promise<Sale[]> => {
        try {
            const response = await fetch(`/purchase-history/sales/${wallet}`);
            const data: Sale[] = await response.json();
            console.log('data: ', data);
            return data;
        } catch (error) {
            console.error('Failed to fetch sales:', error);
            return [];
        }
    };

    useEffect(() => {
        fetchSales().then(setSales);
    }, []);

    return (
        <FlexBoxCol>
            <h1>Sales History</h1>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between'
            }}>
            {sales.map((sale) => (
                    <Card key={sale.id} style={{
                        flex: '0 1 calc(25% - 1em)',
                        margin: '0.5em'
                    }}>
                    <h2>Product ID: {sale.product_id}</h2>
                    <img src={`/EthBelgrade24TonCommerce/${sale.product.image}`} height="100px" alt={sale.product_name} />
                    <p>Product Name: {sale.product_name}</p>
                    <p>Quantity: {sale.qty}</p>
                    <p>Purchase Date: {sale.createdAt}</p>
                    <p>
                        Confirmation BOC: ${sale.confirmation.slice(0, 3)}...${sale.confirmation.slice(-4)}
                        <button onClick={() => navigator.clipboard.writeText(sale.confirmation)}>
                            <i className="fas fa-copy"></i>
                        </button>
                    </p>
                </Card>
            ))}
            </div>
        </FlexBoxCol>
    );
};
