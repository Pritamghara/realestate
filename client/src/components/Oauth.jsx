import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { useDispatch } from 'react-redux'; // Corrected import
import { signinsuccess } from '../redux/user/Userslice'
import { useNavigate } from 'react-router-dom';
import app from '../firebase'
const Oauth = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const handleGoogleClick=async()=>{
        try {

            const provider=new GoogleAuthProvider()
            const auth=getAuth(app)
          
            const result=await signInWithPopup(auth,provider)

            const res=await fetch('/api/auth/google',{
                
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                },
                body:JSON.stringify({
                    name:result.user.displayName,
                    email:result.user.email,
                    photo:result.user.photoURL,
                }),

                
            })
           
            
            const data= await res.json()
            dispatch(signinsuccess(data))
            navigate('/')

            
        } catch (error) {
            console.log("Unable to sign in ",error)
            
        }

    }
  return (
    <button on onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg hover:opacity-95'>Continue with google</button>
  )
}

export default Oauth