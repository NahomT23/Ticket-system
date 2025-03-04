import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const auth = useSelector((state) => state.auth);

  // If not logged in, redirect to sign in
  if (!auth.user) {
    return <Navigate to="/signin" />;
  }
  // If the route requires an admin and the user is not an admin, redirect to user dashboard
  if (requiredRole === 'admin' && auth.user.role !== 'admin') {
    return <Navigate to="/userdashboard" />;
  }
  return children;
};

export default ProtectedRoute;
