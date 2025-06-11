import { Navigate } from 'react-router-dom';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const loggedInUser = localStorage.getItem("user");

  if (!loggedInUser) {
    return <Navigate to="/user-signin" />;
  }
  const user = JSON.parse(loggedInUser);
 
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RoleProtectedRoute;
