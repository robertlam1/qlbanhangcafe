import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Banner from './components/Banner/Banner';
import ProductList from './components/Products/ProductList';
import DetailProduct from './components/Products/DetailProduct';
import Cart from './components/Pages/Cart';
import Login from './components/Pages/Login';
import Footer from './components/Footer/Footer';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Header />}
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
        <Route path="/cart" element={<Cart />} />
      </Routes>
      {!isLoginPage && <Footer />}
    </>
  );
}

export default App;