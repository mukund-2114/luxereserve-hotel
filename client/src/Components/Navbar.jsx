import React, { useContext, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { UserContext } from '../UserContext'
import axios from 'axios'

const Navbar = () => {
  const { user, setUser } = useContext(UserContext)
  return (
    <div>
      <header className="px-4 md:px-16 lg:px-24 xl:px-72 py-4 flex justify-between items-center">
        <Link to={'/'}>
          <div className="flex space-x-6 text-primary font-bold text-xl">
            <img src="/logo.png" alt="" width={200} height={50} />
          </div>
        </Link>


        <div className=" flex border border-gray-300 rounded-full px-4 py-2 gap-2 items-center">

          <Link to={user != null ? '/account' : '/login'} className='flex gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 bg-gray-500 text-white rounded-full relative overflow-hidden">
              <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
            </svg>

          </Link>

          <>
            {
              !!user &&
              <Link to={user != null ? '/account' : '/login'}>
                {user.name}

              </Link>
            }

          </>



        </div>


      </header>
      <hr />
    </div>
  )
}

export default Navbar