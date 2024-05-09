import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Oauth from '../components/Oauth'

const Signup = () => {

  const [formdata, setFormData] = useState({})
  const [error, seterror] = useState(null)
  const [loading, setloading] = useState(false)
  const navigate=useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setloading(true)
    console.log(formdata)
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formdata),
    })

   
      const data = await res.json();
      console.log(data);
    
      if(data.success==false){
        seterror(data.message)
        setloading(false)
        return

      }
      seterror(null)
      setloading(false)
      navigate('/signin')
      
    } catch (error) {
      setloading(false)
      seterror(error.message)
      
    }
    
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Signup</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='username' className='border p-3 rounded-large' id='username' onChange={handleChange} />
        <input type="email" placeholder='email' className='border p-3 rounded-large' id='email' onChange={handleChange} />
        <input type="password" placeholder='password' className='border p-3 rounded-large' id='password' onChange={handleChange} />
        <button disabled={loading} type="submit" className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading?'Loading...':'Sign Up'}</button>
        <Oauth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/Signin"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error &&  <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default Signup
