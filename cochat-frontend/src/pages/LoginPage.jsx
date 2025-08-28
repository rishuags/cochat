// Routing tools & hooks
import { useNavigate } from "react-router";
import { useEffect } from "react";

// Authentication Component
import AuthForm from "../components/AuthForm";


export default function LoginPage({ user }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user]);

    return (
        < div className="p-4" >
            <AuthForm onAuth={() => navigate("/dashboard")} />
        </div >
    );
}