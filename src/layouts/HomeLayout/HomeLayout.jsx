import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from '@/pages/shared/Navbar/Navbar';
import Footer from '@/pages/shared/Footer/Footer';

const HomeLayout = () => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div>
      <Navbar />
      <div className="max-w-11/12 mx-auto">
        <Outlet />
        
      </div>
      <Footer />
    </div>
  );
};

export default HomeLayout;
