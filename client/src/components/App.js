import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Home from './Home'
import NavBar from './NavBar';
import Login from './Login'
import SignUp from './SignUp'
import '../styling/App.css';
import Profile from './Profile';

function App() {

  const [ user, setUser ] = useState(null)
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    fetch('/check_session', {
      credentials: 'include'
    }).then(r => {
      if(r.ok) {
        return r.json().then(user => {
          setUser(user)
          setIsLoading(false)
        })
      } else if(r.status === 401 || r.status === 204){
        // 401 means no session (user not logged in) - this is normal
        setUser(null)
        setIsLoading(false)
      } else {
        throw new Error(`HTTP error! Status: ${r.status}`)
      }
    })
    .catch(error => {
      console.error('Error checking session:', error)
      setUser(null)
      setIsLoading(false)
    })
  }, [])

  if(isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="App">
      <Router>
        <NavBar user={user} setUser={setUser}/>
        <div className='main-content'>
          <Routes>
            {user ? (
              <>
                <Route path='/home' element={<Home user={user} setUser={setUser} />}/>
                <Route path='/profile' element={<Profile user={user} setUser={setUser} />}/>
                <Route path='*' element={<Navigate to="/home" replace />} />
              </>
            ) : (
              <>
                <Route path='/login' element={<Login user={user} setUser={setUser} />} />
                <Route path='/signup' element={<SignUp user={user} setUser={setUser} />} />
                <Route path='*' element={<Navigate to="/login" replace />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
