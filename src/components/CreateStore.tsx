import { useEffect, useState } from "react";
import { useTonConnect } from "../hooks/useTonConnect";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Card, FlexBoxCol, FlexBoxRow, Button, Input } from "./styled/styled";

export function CreateStore() {
  const { wallet } = useTonConnect();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState();
  const [store, setStore] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch(`http://localhost:3000/stores/wallet/${wallet}`);
        const data = await response.json();
        console.log('data: ',data);
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

    // Send data to your backend
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


  return (
    <div className="Container">
      <TonConnectButton style={{ marginLeft: 10 }} />
      <Card>
        <FlexBoxCol>
          <h3>Create Store</h3>
          {store ? (
            <div>
              <h4>{store.name}</h4>
              <p>{store.description}</p>
              <img src={store.image} alt={store.name} />
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
