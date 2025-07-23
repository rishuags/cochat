/* import React, { useState } from 'react';
// import { auth } from './firebase';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// export default function AuthForm({ onAuth }) {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [isLoginMode, setIsLoginMode] = useState(true);
//     const [error, setError] = useState("");

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         try {
//             if (isLoginMode) { //login logic
//                 await signInWithEmailAndPassword(auth, email, password);
//             } else { //signup logic
//                 await createUserWithEmailAndPassword(auth, email, password);
//             }
//             onAuth();
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     return (
//         <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
//             <h2 className="text-xl font-bold mb-4">{isLoginMode ? "Login" : "Sign Up"}</h2>
//             {error && <p className="text-red-500">{error}</p>}
//             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//                 <input
//                     className="p-2 border rounded"
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <input
//                     className="p-2 border rounded"
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <button className="bg-blue-500 text-white py-2 px-4 rounded" type="submit">
//                     {isLoginMode ? "Login" : "Sign Up"}
//                 </button>
//             </form>
//             <button
//                 className="mt-4 text-blue-500 underline"
//                 onClick={() => setIsLoginMode(!isLoginMode)}
//             >
//                 {isLoginMode ? "Need an account? Sign up" : "Already have an account? Log in"}
//             </button>
//         </div>
//     );
} */

import React, { useState } from 'react';
import { auth } from './firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification
} from 'firebase/auth';

export default function AuthForm({ onAuth }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            if (isLoginMode) {
                const userCred = await signInWithEmailAndPassword(auth, email, password);
                const user = userCred.user;

                if (!user.emailVerified) {
                    setError("Please verify your email before logging in.");
                    await auth.signOut();
                    return;
                }

                onAuth(); // they're verified, all good
            } else {
                const userCred = await createUserWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(userCred.user);
                setMessage("Verification email sent. Please check your inbox.");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">{isLoginMode ? "Login" : "Sign Up"}</h2>
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-600">{message}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    className="p-2 border rounded"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="p-2 border rounded"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="bg-blue-500 text-white py-2 px-4 rounded" type="submit">
                    {isLoginMode ? "Login" : "Sign Up"}
                </button>
            </form>
            <button
                className="mt-4 text-blue-500 underline"
                onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    setError("");
                    setMessage("");
                }}
            >
                {isLoginMode ? "Need an account? Sign up" : "Already have an account? Log in"}
            </button>
        </div>
    );
}

