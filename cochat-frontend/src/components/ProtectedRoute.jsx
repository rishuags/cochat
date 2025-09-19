import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // show a spinner or loading UI
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (!user) {
        // redirect to login but remember where user tried to go
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

