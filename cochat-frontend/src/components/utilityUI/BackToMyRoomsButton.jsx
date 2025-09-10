import React from "react";
import { useNavigate } from "react-router-dom";

function BackToMyRoomsButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/my-rooms")}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
            ← Back to My Rooms
        </button>
    );
}

export default BackToMyRoomsButton;