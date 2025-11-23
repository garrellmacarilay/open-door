// src/public-pages/Auth/UnauthorizedPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>🚫 Unauthorized</h1>
      <p>You don’t have permission to access this page.</p>
      <Link to="/">Go back to home</Link>
    </div>
  );
};

export default UnauthorizedPage;
