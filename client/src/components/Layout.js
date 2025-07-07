// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import { Sidebar } from './Sidebar';

const Layout = () => {
  return (
    <>
      <Sidebar />
      <div style={{ marginLeft: '240px', padding: '20px' }}>
        <Outlet /> {/* Renders the nested routes */}
      </div>
    </>
  );
};

export default Layout;
