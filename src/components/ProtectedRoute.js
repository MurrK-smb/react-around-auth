import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, loggedIn, ...props }) => {
  return (
    <Routes>
      <Route {...props}>
        {loggedIn ? children : <Navigate to={"/signin"} />}
      </Route>
    </Routes>
  );
};

export default ProtectedRoute;
