import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styling/NavBar.css'

const NavBar = ({ user, setUser }) => {

    const [ profile, setProfile ] = useState(true)
    const [ navigate ] = useNavigate()

    const handleHome = () => {
        setProfile(!profile)
        if(profile) {
            navigate('/profile')
        } else {
            navigate('/home')
        }
    }

    const handleSignOut = () => {
        fetch('/logout', {
            method: 'DELETE',
            credentials: 'include',
        }).then(() => {
            setUser(null)
            navigate('/login')
        })
    }

  return (
    <div className='navbar'>
        <h1>Web Development</h1>
        {user && (
            <div className='nav-buttons'>
                <button className='nav-button home-button' onClick={handleHome}>
                    {profile ? "Profile" : "Home"}
                </button>
                <button className='nav-button signout-button' onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>
        )}
    </div>
  )
}

export default NavBar