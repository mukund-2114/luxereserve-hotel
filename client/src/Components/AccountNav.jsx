import React, { useContext } from 'react'
import { UserContext } from '../UserContext'
import { Link, Navigate, useParams } from 'react-router-dom'
import axios from 'axios'

const AccountNav = ({action}) => {
    const { user, ready, setUser } = useContext(UserContext)
  if (ready && !user) {
    console.log(ready)
    return <Navigate to='/login' />
  }

  const userLogout = () => {
    axios.get('/logout').then((response) => {
      alert('Logged out successfully')
      setUser(null)
    })
  }
  console.log(action)

//   let { subpage } = useParams();
  if (action === undefined) {
    action = 'profile'
  }
    function linkClasses(type = null) {
        let classes = 'px-6 py-2 rounded-full inline-flex gap-1'
        if (type == "subpage") {
          classes += ' bg-primary text-white'
        }
        else {
          classes += ' bg-gray-200'
        }
        return classes;
      }
  return (
   
        <div className='flex p-2 justify-center gap-2 mt-8'>
        <Link to='/account/' className={linkClasses('profile')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>

          Profile
        </Link>
        <Link to='/account/bookings' className={linkClasses('bookings')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>

          My Bookings
        </Link>
        <Link to='/account/places' className={linkClasses('places')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          My Accommodations
        </Link>
      


    </div>
  )
}

export default AccountNav