import { NavigationMenuDemo } from '@/components/Demo/NavigationMenuDemo';
import Footer from '@/pages/shared/Footer/Footer';
import Navbar from '@/pages/shared/Navbar/Navbar';
import React from 'react';
import { Outlet } from 'react-router';

const HomeLayout = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default HomeLayout;