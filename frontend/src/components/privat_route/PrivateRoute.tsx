import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const PrivateRoute = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('authUser');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token || !userString) {
      alert("Not token or user exists in private route")
      navigate('/login');
    }
  }, [token, userString, navigate]);

  if (!token || !userString) {
    return null; // Prevent rendering anything before redirect
  }

  const user = JSON.parse(userString);
  const { u_id, name, role } = user || {};
  console.log(u_id, name, role);

  return <Outlet />;
};

export default PrivateRoute;
