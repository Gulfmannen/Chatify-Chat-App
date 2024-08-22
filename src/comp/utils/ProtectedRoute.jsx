import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../../ContextProvider/ContextProvider";
import Sidebar from "../Sidebar";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(Context);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="protected-layout">
      <Sidebar />
      <div className="content">{children}</div>
    </div>
  );
};

export default ProtectedRoute;
