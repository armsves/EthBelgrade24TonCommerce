import { useEffect, useState } from "react";
import styled from "styled-components";
import { Address, toNano } from "ton";
import { useTonConnect } from "../hooks/useTonConnect";
import { useTonWallet, TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";
import { Card, FlexBoxCol, FlexBoxRow, Button, Input } from "./styled/styled";
import { useCounterContract } from "../hooks/useCounterContract";
import TonWeb from "tonweb";

export function BrowseStores() {
  const { sender, connected } = useTonConnect();
  const [tonConnectUI] = useTonConnectUI();

  const wallet = useTonWallet();
  const { balance } = useCounterContract()
  //const [tonAmount, setTonAmount] = useState("0.01");
  const tonAmount = "1.5";
  //const [tonRecipient, setTonRecipient] = useState("EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c");
  const tonRecipient = "0QAoQUI39QSi6ZVeAZixR5ZG8xG_ht-1JZFtKUgBb-_UE5Qe";
  const [enoughBalance, setEnoughBalance] = useState(false)
  const Cell = TonWeb.boc.Cell;

  const executePurchase = async () => {
    try {
      const result = await tonConnectUI.sendTransaction({
        messages: [
          {
            address: tonRecipient,
            amount: (Number(tonAmount) * 10 ** 9).toString(),
            //payload: "purchase1234"
          }
        ],
        validUntil: Date.now() + 5 * 60 * 1000
      });
      console.log("result = ", result.boc);
      console.log(Cell.fromBoc(result.boc));
    }
    catch (e) {
      console.log("error = ", e)
    }
  }


  useEffect(() => {
    setEnoughBalance(Number(balance) > Number(tonAmount))
    console.log("enoughBalance = ", enoughBalance)
  }
    , [balance])

  /*
  const executePurchase = async () => {
    const result = await sender.send({
      to: Address.parse(tonRecipient),
      value: toNano(tonAmount),
    });

    setTimeout(() => {
      console.log("result = ", result);
    }, 10000);
  }
  */
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    try {
      // ... existing code ...

      // Check if a file is selected
      if (selectedFile) {
        // Create a FormData object
        const formData = new FormData();

        // Add the file to the FormData object
        formData.append('file', selectedFile);

        // Send a POST request to the /upload route on your server
        const response = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('File upload failed');
        }

        console.log('File uploaded successfully');
        console.log('response = ', response);
        console.log('selectedFile = ', selectedFile);
        console.log('selectedFile = ', selectedFile.name);
        setFileName(selectedFile.name);
        setFileUploadSuccess(true);
      }
    } catch (e) {
      console.log("error = ", e)
    }
  };

  return (
    <div className="Container">
      <TonConnectButton style={{ marginLeft: 10 }} />
      <Card>
        <FlexBoxCol>
          <h3>Buy Item</h3>
          Balance: {balance}
          <FlexBoxRow>
          </FlexBoxRow>
          <FlexBoxRow>
            Price: {tonAmount}
          </FlexBoxRow>
          <FlexBoxRow>
            Recipient: {tonRecipient}
          </FlexBoxRow>
          <Button
            disabled={!connected || !enoughBalance}
            style={{ marginTop: 18 }}
            onClick={executePurchase}        >
            Buy Now!
          </Button>
        </FlexBoxCol>
        <FlexBoxCol>
          <FlexBoxRow className="py-6">
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadFile}>Upload</button>
          </FlexBoxRow>
          {fileUploadSuccess && (
            <FlexBoxRow className="py-6">
              <p>File uploaded successfully!</p>
              <img src={`/${fileName}`} width="100px" alt="Uploaded file" />
            </FlexBoxRow>
          )}
        </FlexBoxCol>
      </Card>
    </div>
  );
}
