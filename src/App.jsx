import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Banner from './components/Banner/Banner';
import ProductList from './components/Products/ProductList';
import DetailProduct from './components/Products/DetailProduct';
import Cart from './components/Pages/Cart';
import Login from './components/Pages/Login';
import Signup from './components/Pages/Signup';
import Profile from './components/Pages/Profile';
import Footer from './components/Footer/Footer';

function App() {
  const location = useLocation();
  const hideChrome = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!hideChrome && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Banner />
              <ProductList />
            </>
          }
        />
        <Route path="/product/:id" element={<DetailProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  );
}

export default App;