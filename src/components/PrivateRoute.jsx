// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { api } from '../api/api';

const PrivateRoute = ({ allowedRoles = [] }) => {
  const isAuthenticated = api.auth.checkAuth();
  const user = api.auth.getStoredUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;