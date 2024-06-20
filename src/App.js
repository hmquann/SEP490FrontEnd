import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <>
      <Header />
     <Routes>
     <Route path="/login" element={<Login />} />
     </Routes>
    </>

  );
}

export default App;
