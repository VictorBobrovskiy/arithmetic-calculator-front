import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavBar from './NavBar';

const Layout = () => {
  return (
    <div style={{ minHeight: '100vh' }}>
      <NavBar />
      <Container className="py-4">
        <Outlet />
      </Container>
    </div>
  );
};

export default Layout;