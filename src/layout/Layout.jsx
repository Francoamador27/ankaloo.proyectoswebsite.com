import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import UseAuth from '../hooks/useAuth';
import Footer from '../components/footer/Footer';
import ScrollToTop from '../components/scrolltop/ScrollTop';

const Layout = () => {
  const { user, error } = UseAuth({ middleware: 'guest' });

  return (
    <>
<ScrollToTop/>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
