import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const RegisterPage = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const registerUser =async (e)=>{
      e.preventDefault();
      try{
        const response = await axios.post('/register',{
          name,email,password
        })
        if(response.status == 201){
          alert("User registered successfully!")
        }
        setName('');
        setEmail('');
        setPassword('');
      }
      catch(err){
        alert(err.response.data.message);
        setName('');
        setEmail('');
        setPassword('');
      }
  }
  return (
    <div className='login'>
        <div className='w-11/12 md:w-1/2 lg:w-4/12 xl:w-3/12 mx-auto mt-8 flex flex-col border border-gray-300 rounded-lg '>
        <h3 className='text-center py-5 px-4 font-bold'>Register</h3>
        <hr />
        <form className='p-3' onSubmit={registerUser}>
            <input type="text" placeholder='Your Name' className='w-full rounded-2xl p-2 border' value={name} onChange={(e)=>setName(e.target.value)}/>
            <input type="email" placeholder='Enter email' className='w-full rounded-2xl p-2 border mt-3' value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder='Enter password' className='w-full rounded-2xl p-2 border mt-3' value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button className='w-full bg-primary py-2 px-3 mt-2 text-white rounded-2xl mb-3'>Register</button>
            <span>Already have an account?</span> <Link to='/login' className='underline'>Login Now</Link>
        </form>
    </div>
    </div>
  )
}

export default RegisterPage