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
import Admin from './components/Pages/Admin';
import AdminProduct from './components/Pages/Adminproduct';
import AdminCategory from './components/Pages/Admincategory';
import AdminCustomer from './components/Pages/Admincustomer';
import AdminEmployee from './components/Pages/Adminemployee';
import AdminBill from './components/Pages/Adminbill';
import AdminInvoiceDetails from './components/Pages/Admininvoicedetails';
import Footer from './components/Footer/Footer';

function App() {
  const location = useLocation();
  const hideChrome =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname.startsWith('/admin');

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
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<DetailProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/products" element={<AdminProduct />} />
        <Route path="/admin/category" element={<AdminCategory />} />
        <Route path="/admin/customer" element={<AdminCustomer />} />
        <Route path="/admin/employee" element={<AdminEmployee />} />
        <Route path="/admin/bill" element={<AdminBill />} />
        <Route path="/admin/invoicedetails" element={<AdminInvoiceDetails />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  );
}

export default App;