import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, FlexBoxCol, FlexBoxRow, Button, Input } from "./styled/styled";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useTonConnect } from "../hooks/useTonConnect";

const Stores = () => {
    const [tonConnectUI] = useTonConnectUI();
    const { wallet } = useTonConnect();
    const { storeId } = useParams();
    const [store, setStore] = useState<Store | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    interface Store {
        id: number;
        name: string;
        owner_address: string;
        description: string;
        image: string;
        active: boolean;
        // add other properties here as needed
    }

    interface Product {
        id: string;
        name: string;
        image: string;
        description: string;
        price: number;
        qty: number;
        active: boolean;
    }

    const fetchStoreAndProducts = async (storeId: string | undefined): Promise<{ store: Store | null, products: Product[] }> => {
        try {
            const storeResponse = await fetch(`http://localhost:3000/stores/${storeId}`);
            const storeData: Store = await storeResponse.json();

            console.log('storeData: ', storeData);
            console.log('storeId: ', storeId);

            const productsResponse = await fetch(`http://localhost:3000/products/stores/${storeId}`);
            const productsData: Product[] = await productsResponse.json();

            console.log('productsData: ', productsData);

            return { store: storeData, products: productsData };
        } catch (error) {
            console.error('Failed to fetch store and products:', error);
            return { store: null, products: [] };
        }
    };

    useEffect(() => {
        fetchStoreAndProducts(storeId).then((data) => {
            if (data) {
                setStore(data.store);
                setProducts(data.products);
            }
        });
    }, [storeId]);

    if (!store) {
        return <div>Loading...</div>;
    }

    const executePurchase = async (id: string, tonAmount: number) => {
        try {
            const result = await tonConnectUI.sendTransaction({
                messages: [
                    {
                        address: store.owner_address,
                        amount: (Number(tonAmount) * 10 ** 9).toString(),
                        //payload: "purchase1234"
                    }
                ],
                validUntil: Date.now() + 5 * 60 * 1000
            });
            console.log("result = ", result.boc);

            const data = {
                product_id: id,
                buyer_address: wallet,
                qty: 1,
                price: tonAmount,
                status: "paid",
                confirmation: result.boc
            };

            // Send a POST request to your server to create a product
            const response2 = await fetch('http://localhost:3000/purchase-history/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            console.log("response2 = ", response2);

            const response3 = await fetch(`http://localhost:3000/products/${id}/decrease`, { method: 'POST', });

            console.log("response3 = ", response3);
            //console.log(Cell.fromBoc(result.boc));
            fetchStoreAndProducts(storeId).then((data) => {
                if (data) {
                    setStore(data.store);
                    setProducts(data.products);
                }
            });
        }
        catch (e) {
            console.log("error = ", e)
        }
    }

    return (
        <div>
            <h1>{store.name}</h1>
            <h2>Products</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {products.map(product => (
                    <div key={product.id} style={{ flex: '1 0 21%', margin: '1%', border: '1px solid #ccc', padding: '1em' }}>
                        <img src={`../${product.image}`} height="100px" alt={product.name} />
                        <h2>Name: {product.name}</h2>
                        <p>Description: {product.description}</p>
                        <p>Price: {product.price}</p>
                        <p>Quantity: {product.qty}</p>
                        <Button
                            //disabled={!connected || !enoughBalance}
                            style={{ marginTop: 18 }}
                            onClick={() => executePurchase(product.id, product.price)}>
                            Buy Now!
                        </Button>
                    </div>

                ))}
            </div>
        </div>
    );
};

export default Stores;
