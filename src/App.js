import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config'

import Home from './pages/Home'
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';


function App() {
  const [isAuth, setIsAuth] = useState(false);

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login"
    })
  }

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuth');
    if (isAuth === 'true') {
      setIsAuth(true);
    }
  }, []);

  return (
    <Router className="App">
      <nav className="navbar">
        <div className="center-section">
          <Link to='/'>Home</Link>
          {isAuth && <Link to='/createPost'>Create Post</Link>}
        </div>
        <div className="right-section">
          {!isAuth ? <Link to='/login'>Login</Link> :
            <button className="log-out" onClick={signUserOut}>Log out</button>
          }
        </div>
      </nav>
      <Routes>
        <Route path='/' element={<Home isAuth={isAuth} />} />
        <Route path='/CreatePost' element={<CreatePost isAuth={isAuth} />} />
        <Route path='/login' element={<Login setIsAuth={setIsAuth} />} />
      </Routes>
    </Router>
  );
}

export default App;
