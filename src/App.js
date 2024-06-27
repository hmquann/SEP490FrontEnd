import logo from './logo.svg';
import './App.css';

import UserWallet from './pages/wallet/UserWallet';
import PaymentFailed from './pages/wallet/PaymentFailed';
import PaymentSuccess from './pages/wallet/PaymentSuccess';
import UserWallet from './wallet/UserWallet';
import BrandList from './brand/BrandList';


function App() {
  return (
    <>
      <Header />
     <Routes>
     <Route path="/login" element={<Login />} />

     <Route path="/menu/wallet" element={<UserWallet />} />
     <Route path="/payment-success" element={<PaymentSuccess />} />
     <Route path="/payment-failed" element={<PaymentFailed />} />

     <Route path="/register" element={<Register />} />
     <Route path="/brand" element={<BrandList />} />

     </Routes>
    </>

  );
}

export default App;
