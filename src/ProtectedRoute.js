import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AppContext from "./Context/AppContext";

export const ProtectedRoute = ({ children }) => {
  console.log("Inside Protected Routes")
  const { auth } = useContext(AppContext);

  if (auth === null) {
    return <div>Loading...</div>; // or a spinner
  }

  return auth ? children : <Navigate to="/login" />;
};
