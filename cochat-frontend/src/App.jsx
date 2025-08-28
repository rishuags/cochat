
// React Hooks and Firebase imports
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

// Routing Tools
import { Routes, Route, Navigate } from 'react-router';

// App Components
import AuthForm from './components/AuthForm.jsx';
import ChatRoom from './components/ChatRoom.jsx';
import { ApiKeyInput } from './components/ApiKeyInput.jsx';

// App Pages 
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';


// React Context
import { ApiKeyProvider } from './context/ApiKeyContext.jsx';


function App() {
  const [user, setUser] = useState(null); // Holds the logged-in user
  const [loading, setLoading] = useState(true); // While checking auth status

  // onAuthStateChanged Hook
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) { // If user is logged in AND email is verified
        setUser(firebaseUser);  // Save user info into state
      } else {
        setUser(null);  // Otherwise treat as unauthenticated
      }
      setLoading(false); // Done checking auth state
    });
    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  // const handleLogout = () => {
  //   signOut(auth);
  // };

  if (loading) return <p className="text-center mt-10">Loading...</p>; // Loading check while firebase verifies user

  // if (!user) return <AuthForm onAuth={() => { }} />;

  // return (

  //   <div className="p-4">
  //     <div className="flex justify-between items-center mb-4">
  //       <h1 className="text-2xl font-bold">CoChat</h1>
  //       <button onClick={handleLogout} className="text-sm text-red-500 underline">
  //         Logout
  //       </button>
  //     </div>
  //     <ApiKeyProvider>
  //       <ApiKeyInput />
  //       <ChatRoom />
  //     </ApiKeyProvider>
  //   </div>


  // );

  return (

    <Routes>
      {/* Login page – pass user in case you want to auto-redirect if already logged in */}
      <Route path="/login" element={<LoginPage user={user} />} />

      {/* Dashboard – protect it behind auth check */}
      <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />

      {/* Room page – also protected by auth check */}
      {/* <Route path="/room/:roomId" element={user ? <RoomPage /> : <Navigate to="/login" />} /> */}

      {/* Fallback – if route doesn't match, send user to dashboard if logged in, else login */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>

  );

}

export default App;
