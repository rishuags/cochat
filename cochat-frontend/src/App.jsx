/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'*/

/*import Header from './Header.jsx'
import Footer from './Footer.jsx'
import MyList from './MyList.jsx'
import Card from './Card.jsx'
import AuthForm from './AuthForm.jsx';



function App() {
  


  return (
    <>
      <AuthForm />
      <Header />
      <MyList />
      <Card />
      <Footer />
    </>

  )

}

export default App */



import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import AuthForm from './AuthForm.jsx';
import Student from './Student.jsx';
import ChatRoom from './ChatRoom.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!user) return <AuthForm onAuth={() => { }} />;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">CoChat</h1>
        <button onClick={handleLogout} className="text-sm text-magenta-500 underline">
          Logout
        </button>
      </div>
      <>
        <Student name="A" age={20} isStudent={true} />
        <Student name="B" age={30} isStudent={false} />
        <Student name="C" age={40} isStudent={false} />
        <Student name="D" age={50} isStudent={false} />
        <ChatRoom />
      </>
    </div>
  );
}

export default App;
