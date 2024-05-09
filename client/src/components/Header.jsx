// Header.jsx

import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useLocation hook
import { useDispatch, useSelector } from 'react-redux';
import { signinsuccess } from '../redux/user/Userslice.js'; // Import the appropriate action from your userSlice file

const Header = () => {
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const location = useLocation(); // Get the current location


  const [searchterm, setsearchterm] = useState('')

  // Check if the current location is the sign-in page
  const isSignInPage = location.pathname === '/signin';
  const handleSubmit=(e)=>{

    e.preventDefault();
    const urlParams=new URLSearchParams(window.location.search)
    urlParams.set('searchTerm',searchterm)
    const searchQuery=urlParams.toString()
    navigate(`/search?${searchQuery}`)


  }

  useEffect(() => {
    const urlParams=new URLSearchParams(location.search)
    const searchtermurl=urlParams.get('searchTerm')

    if(searchtermurl){
      setsearchterm(searchtermurl)
    }
  }, [location.search])
  

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
          <span className='text-slate-500'>Briks </span>
          <span className='text-slate-700'>Estate</span>
        </h1>
        <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input value={searchterm} onChange={(e)=>setsearchterm(e.target.value)} type="text" placeholder='search...' className='bg-transparent focus:outline-none w-24 sm:w-64'/>
          <button>

          <FaSearch className='text-slate-600'/>
          </button>
        </form>
        <ul className='flex gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
          </Link>
          {/* Check if the user is authenticated and it's not the sign-in page */}
          {currentUser ? (
  <Link to='/profile'>
    <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
  </Link>
) : !isSignInPage ? (
  <Link to='/signin'>
    <li className='text-slate-700 hover:underline'>Sign in</li>
  </Link>
) : null}

          
         
        </ul>
      </div>
    </header>
  );
};

export default Header;
