import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth";

const AuthContext = createContext();

// Custom hook
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // firebase user or null
    const [loading, setLoading] = useState(true); // while checking auth state
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Force a reload to ensure emailVerified status is up to date
                await firebaseUser.reload();
                if (firebaseUser.emailVerified) {
                    setUser(firebaseUser);
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const signup = async (email, password) => {
        setAuthError(null);
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(cred.user);

            // Do *not* set user yet; wait until verified
            return { success: true };
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                return { success: false, message: "Email already in use. Try logging in." };
            }
            if (error.code === "auth/invalid-email") {
                return { success: false, message: "Invalid email format." };
            }
            if (error.code === "auth/weak-password") {
                return { success: false, message: "Password must be at least 6 characters." };
            }
            return { success: false, message: error.message || "Signup failed." };
        }

    };

    const login = async (email, password) => {
        setAuthError(null);
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            // Force reload to pick up verification
            await cred.user.reload();
            if (!cred.user.emailVerified) {
                setAuthError("Please verify your email before logging in.");
                await auth.signOut();
                return { success: false, error: "Email not verified" };
            }
            setUser(cred.user);
            return { success: true };
        } catch (err) {
            setAuthError(err.message);
            return { success: false, error: err.message };
        }
    };

    const logout = async () => {
        await auth.signOut();
        setUser(null);
    };

    const value = {
        user,
        loading,
        authError,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}