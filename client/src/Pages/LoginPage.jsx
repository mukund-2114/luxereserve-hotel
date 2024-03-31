import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { UserContext } from '../UserContext'

const LoginPage = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)
  const {setUser}=useContext(UserContext)
  const loginHandler = async(e)=>{
    e.preventDefault();
    try{
        const response = await axios.post('/login',{email,password})
        if(response.status === 200){
          setUser(response.data)
          alert("Login successful")
          setRedirect(true)
        }
    }    
    catch(err){
      alert(err.response.data.message)
    }
    finally{
      setEmail('')
      setPassword('')
    }
  }
  if(redirect){
    return <Navigate to={'/'}/>
  }
  return (
    <div className='login'>
      <div className='w-3/12 mx-auto mt-8 flex flex-col border border-gray-300 rounded-lg '>
        <h3 className='text-center py-5 px-4 font-bold'>Log in or sign up</h3>
        <form className='p-3' onSubmit={loginHandler}>
          <input type="email" placeholder='Enter email' className='w-full rounded-2xl p-2 border' value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder='Enter password' className='w-full rounded-2xl p-2 border mt-3'value={password}  onChange={(e)=> setPassword(e.target.value)} />
          <button className='w-full bg-primary py-2 px-3 mt-5 text-white rounded-2xl mb-3'>Login</button>
          <span>Don't have an account?</span> <Link to='/register' className='underline'>Register Now</Link>
        </form>
      </div>
    </div>
  )
}

export default LoginPage