import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function DashboardPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth);
        navigate("/login");
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">CoChat Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 underline"
                >
                    Logout
                </button>
            </div>

            <div className="space-y-2 mt-6">
                <button
                    onClick={() => navigate("/create-room")}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded"
                >
                    Create Room
                </button>

                <button
                    onClick={() => navigate("/join-room")}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded"
                >
                    Join Room
                </button>

                <button
                    onClick={() => navigate("/my-rooms")}
                    className="w-full bg-gray-500 text-white py-2 px-4 rounded"
                >
                    My Rooms (coming soon)
                </button>
            </div>
        </div>
    );
}
