import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
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

  return (
    <Router className="App">
      <nav>
        <Link to='/'>Home</Link>

        {!isAuth ? <Link to='/login'>Login</Link> :
          <>
            <Link to='/CreatePost'>Create Post</Link>
            <button onClick={signUserOut}>Log out</button>
          </>
        }
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
