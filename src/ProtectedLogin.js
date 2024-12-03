import React from "react";
import { Navigate, Route } from "react-router-dom";

export const ProtectedLogin = ({ auth, children }) => {
  if (auth) {
    return <Navigate to="/home" />;
  }
  return children;
};