import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Navigate } from "react-router-dom";

export default function LoginPage() {
    const { user, login, authError, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, from, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        if (!email.trim() || !password.trim()) {
            setMessage("Email and password are required.");
            return;
        }
        setLoadingLogin(true);
        const result = await login(email, password);
        setLoadingLogin(false);
        if (!result.success) {
            setMessage(result.error);
        }
        // if success, user state will trigger useEffect redirect
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {message && <p className="mb-2 text-center text-red-500">{message}</p>}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 border rounded"
                    disabled={loadingLogin}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 border rounded"
                    disabled={loadingLogin}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    disabled={loadingLogin}
                >
                    {loadingLogin ? "Logging in..." : "Login"}
                </button>
            </form>
            <div className="mt-4 text-center">
                <button
                    className="text-blue-500 underline"
                    onClick={() => navigate("/signup")}
                    disabled={loadingLogin}
                >
                    Need an account? Sign up
                </button>
            </div>
        </div>
    );
}