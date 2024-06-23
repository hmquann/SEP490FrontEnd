import logo from './logo.svg';
import './App.css';
import UserWallet from './wallet/UserWallet';

function App() {
  return (
    <>
      <Header />
     <Routes>
     <Route path="/login" element={<Login />} />
     <Route path="/menu/wallet" element={<UserWallet />} />
     {/* <Route path="/payment-success" element={<PaymentSuccess />} />
     <Route path="/payment-failed" element={<PaymentFailed />} /> */}

     </Routes>
    </>

  );
}

export default App;
