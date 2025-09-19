import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
    const { signup, authError } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loadingSignup, setLoadingSignup] = useState(false);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);


    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage("");
        if (!email.trim() || !password.trim()) {
            setMessage("Email and password are required.");
            return;
        }
        if (!email.includes("@") || !email.includes(".")) {
            setMessage("Please enter a valid email address.");
            return;
        }
        setLoadingSignup(true);
        const result = await signup(email, password);
        setLoadingSignup(false);
        if (result.success) {
            setIsSuccess(true)
                ; setMessage("Verification email sent. Please check your inbox (and spam folder). After verifying, return here and log in.");
            // optionally navigate to verify notice page
            //navigate("/verify");
        } else {
            setIsSuccess(false);
            setMessage(result.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            {message && (
                <p className={`mb-2 text-center ${isSuccess ? "text-green-600" : "text-red-500"}`}>
                    {message}
                </p>
            )}
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 border rounded"
                    disabled={loadingSignup}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 border rounded"
                    disabled={loadingSignup}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    disabled={loadingSignup}
                >
                    {loadingSignup ? "Signing Up..." : "Sign Up"}
                </button>
            </form>
            <div className="mt-4 text-center">
                <button
                    className="text-blue-500 underline"
                    onClick={() => navigate("/login")}
                    disabled={loadingSignup}
                >
                    Already have an account? Login
                </button>
            </div>
        </div>
    );
}