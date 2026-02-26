import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/header/Header';
import UseAuth from '../hooks/useAuth';
import Footer from '../components/footer/Footer';
import ScrollToTop from '../components/scrolltop/ScrollTop';

const Layout = () => {
  const { user, error } = UseAuth({ middleware: 'guest' });
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <ScrollToTop />
      <Header />
      <main className={isHome ? '' : 'pt-20 lg:pt-24 bg-white'}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
