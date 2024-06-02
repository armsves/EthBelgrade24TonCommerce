import { useEffect, useState } from "react";
import { useTonConnect } from "../hooks/useTonConnect";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Card, FlexBoxCol, FlexBoxRow, Button, Input } from "./styled/styled";

export function CreateStore() {
  const { wallet } = useTonConnect();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
  const [store, setStore] = useState<Store | null>(null);

  interface Store {
    id: number;
    name: string;
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

  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      if (store) {
        const response = await fetch(`http://localhost:3000/products/stores/${store.id}`);
        const data: Product[] = await response.json();
        console.log('data: ', data);
        if (data) {
          setProducts(data);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (store) {
      fetchProducts();
    }
  }, [store]);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch(`http://localhost:3000/stores/wallet/${wallet}`);
        const data: Store = await response.json();
        console.log('data: ', data);
        if (data) {
          setStore(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchStore();
  }, [wallet]);

  const handleImageChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImageChange2 = (event: any) => {
    setSelectedFile2(event.target.files[0]);
  };

  const uploadFile = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const response = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('File upload failed');
        }
      }
    } catch (e) {
      console.log("error = ", e)
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    await uploadFile();

    const data = {
      name,
      description,
      owner_address: wallet,
      active: '1',
      image: selectedFile,
    };

    try {
      const response = await fetch('http://localhost:3000/stores/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleActive = async () => {
    try {
      const response = await fetch(`http://localhost:3000/stores/${store?.id}/toggle-active`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Response is not OK');
      }

      const updatedStore = await response.json();
      setStore(updatedStore);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleActiveProduct = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/products/${productId}/toggle-active`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Response is not OK');
      }

      const updatedProduct = await response.json();

      // Create a new array where the product with the specified id is replaced with the updated product
      const updatedProducts = products.map(product => product.id === productId ? updatedProduct : product);

      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const [productForm, setProductForm] = useState({ storeId: store?.id, name: '', image: '', description: '', price: '', qty: '', active: 1 });

  const handleProductChange = (e: any) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const submitProduct = async (e: any) => {
    e.preventDefault();

    try {
      if (selectedFile2) {
        const data = {
          store_id: store?.id,
          name: productForm.name,
          description: productForm.description,
          image: selectedFile2.name,
          price: productForm.price,
          qty: productForm.qty,
          active: '1',
        };

        const formData = new FormData();
        formData.append('file', selectedFile2);
        const response = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData,
        });
        console.log('response', response)

        if (!response.ok) {
          throw new Error('File upload failed');
        }

        // Send a POST request to your server to create a product
        const response2 = await fetch('http://localhost:3000/products/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        //console.log(response2)
        fetchProducts();
      }
    } catch (e) {
      console.log("error = ", e)
    }

  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
      }

      // Remove the deleted product from the state
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="Container">
      <TonConnectButton style={{ marginLeft: 10 }} />
      <Card>
        <FlexBoxCol>
          <h3>Create Store</h3>
          {store ? (
            <div>
              <h4>{store?.name}</h4>
              <button onClick={toggleActive}>{store.active ? 'Deactivate' : 'Activate'}</button>
              <p>{store.description}</p>
              <img src={`/EthBelgrade24TonCommerce/${store.image}`} height="100px" alt={store.name} />
              {store.active && (
                <form onSubmit={submitProduct} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label>
                    Name:
                    <input type="text" name="name" value={productForm.name} onChange={handleProductChange} required />
                  </label>
                  <label>
                    Image:
                    <input type="file" onChange={handleImageChange2} required />
                  </label>
                  <label>
                    Description:
                    <input type="text" name="description" value={productForm.description} onChange={handleProductChange} required />
                  </label>
                  <label>
                    Price:
                    <input type="number" name="price" value={productForm.price} onChange={handleProductChange} required />
                  </label>
                  <label>
                    Quantity:
                    <input type="number" name="qty" value={productForm.qty} onChange={handleProductChange} required />
                  </label>
                  <button type="submit">Create Product</button>
                </form>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {products.map((product) => (
                  <div key={product.id} style={{ flex: '1 0 21%', margin: '1%', border: '1px solid #ccc', padding: '1em' }}>
                    <img src={`/EthBelgrade24TonCommerce/${product.image}`} height="100px" alt={product.name} />
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>{product.price}</p>
                    <p>{product.qty}</p>
                    <button onClick={() => deleteProduct(product.id)}>Delete</button>
                    <button onClick={() => toggleActiveProduct(product.id)}>{product.active ? 'Deactivate' : 'Activate'}</button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <label style={{ margin: '10px 0' }}>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label style={{ margin: '10px 0' }}>
                Description:
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
              </label>
              <label style={{ margin: '10px 0' }}>
                Image:
                <input type="file" onChange={handleImageChange} required />
              </label>
              <Button type="submit" style={{ margin: '20px 0' }}>Create Store</Button>
            </form>
          )}
        </FlexBoxCol>
      </Card>
    </div>
  )
};
