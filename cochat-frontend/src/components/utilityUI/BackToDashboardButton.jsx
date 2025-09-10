import React from "react";
import { useNavigate } from "react-router-dom";

function BackToDashboardButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
            ← Back to Dashboard
        </button>
    );
}

export default BackToDashboardButton;