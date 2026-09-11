import React, { useState } from 'react';
import SignUp from './pages/SignUp';
import Login from './pages/Login';

function App() {
  const [currentPage, setCurrentPage] = useState('signup');

  return (
    <>
      {currentPage === 'signup' ? (
        <SignUp onNavigateToLogin={() => setCurrentPage('login')} />
      ) : (
        <Login onNavigateToSignUp={() => setCurrentPage('signup')} />
      )}
    </>
  )
}

export default App
