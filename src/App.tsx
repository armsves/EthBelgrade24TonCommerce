import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Counter } from "./components/Counter";
import { CreateStore } from "./components/CreateStore";
import { BrowseStores } from "./components/BrowseStores";
import { PurchaseHistory } from "./components/PurchaseHistory";
import { SalesHistory } from "./components/SalesHistory";
import Stores from './components/Stores';
import { Jetton } from "./components/Jetton";
import { TransferTon } from "./components/TransferTon";
import styled from "styled-components";
import { Button, FlexBoxCol, FlexBoxRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import "@twa-dev/sdk";
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';


const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 20px 20px;
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

function App() {
  const { network, connected } = useTonConnect();

  /*
              <Counter />
              <TransferTon />
              <Jetton />
  */
  return (
    <Router>
      <StyledApp>
        <AppContainer>
          <FlexBoxCol>
            <FlexBoxRow>
              <TonConnectButton />
              <Button>
                {network
                  ? network === CHAIN.MAINNET
                    ? "mainnet"
                    : "testnet"
                  : "N/A"}
              </Button>
              {connected ? (
                <>
                  <Link to="/CreateStore"><Button>Create Store</Button></Link>
                  <Link to="/BrowseStores"><Button>Browse Stores</Button></Link>
                  <Link to="/PurchaseHistory"><Button>Purchase History</Button></Link>
                  <Link to="/SalesHistory"><Button>Sales History</Button></Link>
                </>
              ) : (
                <>
                  <h3>Connect to TON</h3>
                </>
              )}
            </FlexBoxRow>
            {connected && (
              <Routes>
                <Route path="/CreateStore" element={<CreateStore />} />
                <Route path="/BrowseStores" element={<BrowseStores />} />
                <Route path="/stores/:storeId" element={<Stores />} />
                <Route path="/PurchaseHistory" element={<PurchaseHistory />} />
                <Route path="/SalesHistory" element={<SalesHistory />} />
              </Routes>
            )}
          </FlexBoxCol>
        </AppContainer>
      </StyledApp>
    </Router>
  );
}

export default App;
