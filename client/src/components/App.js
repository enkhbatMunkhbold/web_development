import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Home from './Home'
import NavBar from './NavBar';
import '../styling/App.css';

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
      } else if(r.status === 204){
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
        <div>
          <Routes>
            <Route path='/home' element={<Home />}/>
            <Route path='*' element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
