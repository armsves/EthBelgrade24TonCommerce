import { useEffect, useState } from "react";
import styled from "styled-components";
import { Address, toNano } from "ton";
import { useTonConnect } from "../hooks/useTonConnect";
import { useTonWallet, TonConnectButton } from "@tonconnect/ui-react";
import { Card, FlexBoxCol, FlexBoxRow, Button, Input } from "./styled/styled";
import { useCounterContract } from "../hooks/useCounterContract";

export function CreateStore() {
  const { sender, connected, wallet } = useTonConnect();

  //const wallet = useTonWallet();
  const { balance } = useCounterContract()
  //const [tonAmount, setTonAmount] = useState("0.01");
  const tonAmount = "1.5";
  //const [tonRecipient, setTonRecipient] = useState("EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c");
  const tonRecipient = "kQDr9DIuhFXzwWcH_HtSlVcqCJo4NYYvf25QsGET4rY3n3GB";
  const [enoughBalance, setEnoughBalance] = useState(false)

  useEffect(() => {
    setEnoughBalance(Number(balance) > Number(tonAmount))
    console.log("enoughBalance = ", enoughBalance)
  }
  , [balance])

  return (
    <div className="Container">
      <TonConnectButton style={{ marginLeft: 10 }} />
      <Card>
        <FlexBoxCol>
          <h3>Buy Item</h3>
          <p>Balance: {balance}</p>
          <p> Wallet: {wallet}</p>
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
            onClick={async () => {
              sender.send({
                to: Address.parse(tonRecipient),
                value: toNano(tonAmount),
              });
            }}
          >
            Transfer
          </Button>
        </FlexBoxCol>
      </Card>
    </div>
  );
}
