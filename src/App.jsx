//import axios from 'axios';
import { Routes, Route } from 'react-router';
// //import { useState } from 'react';
import { HomePage } from './pages/HomePage';
// import { CheckoutPage } from './pages/checkout/CheckoutPage';
// import { OrdersPage } from './pages/orders/OrdersPage';
import './App.css'

function App() {
  // const [cart, setCart] = useState([]);

  // const loadCart = async () => {
  //   const response = await axios.get('/api/cart-items?expand=product');
  //   setCart(response.data);
  // };

  //useEffect(() => { loadCart(); }, []);

  return (
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path="rooms" element={<div>Rooms Available</div>}/>
      <Route path="rooms" element={<div>Only for Students</div>}/>
    </Routes>
  )
}

export default App
