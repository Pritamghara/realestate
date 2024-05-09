import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRef } from 'react';
import app from '../firebase';


import {Link} from 'react-router-dom'



import { clearUserError, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserFailure, signoutUserStart, signoutUserSuccess, updateUserFailure,updateUserStart,updateUserSuccess } from '../redux/user/Userslice';

const Profile = () => {

  const fileref = useRef(null);
  const { currentUser,loading,error } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [fileper, setFileper] = useState(0);
  const [fileerror, setFileerror] = useState(false);
  const [formdata, setFormdata] = useState({  });
  const [imageUploaded, setImageUploaded] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || '');

  const [userListing, setuserListing] = useState([])


  const  [updatestate, setupdatestate] = useState(false)


  const [showlistingerror, setshowlistingerror] = useState(false)

  console.log(userListing)

  const dispatch=useDispatch()


  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileper(Math.round(progress));
      },
      (error) => {
        setFileerror(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormdata({...formdata,avatar:downloadURL})
            setImageUploaded(true)
        });
      }
    );
  }

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);


  useEffect(() => {
    dispatch(clearUserError())
  
    
  }, [])
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setupdatestate(false);
    }, 3000); 
    return () => clearTimeout(timer);
  }, [updatestate]);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUploaded(false)
      setFileerror(false); // Reset fileerror to false when a new file is selected
    }
  }
 

  const handleChange=(e)=>{
    setFormdata({...formdata,[e.target.id]:e.target.value})
  }

  const handleSubmit=async(e)=>{

    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res=await fetch(`/api/user/update/${currentUser._id}`,{


        method:'POST',
        headers:{
          'content-Type':'application/json',
        },
        body:JSON.stringify(formdata)
      })

      const data=await res.json()
   

      if(data.success===false){
        dispatch(updateUserFailure(data.message))
        return
      }

      dispatch(updateUserSuccess(data))
      setupdatestate(true) 

      
    } catch (error) {
      dispatch(updateUserFailure(error.message))
      
    }

  }

  const handleDeleteUser=async(e)=>{

    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) {
      return; // If the user cancels, exit the function
    }

    try {
      dispatch(deleteUserStart())
      const res=await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',

      })
      const data=await res.json();
      if(data.sucess===false){
        dispatch(deleteUserFailure(data.message))
        return;

      }
      dispatch(deleteUserSuccess(data))

      
    } catch (error) {
      dispatch(deleteUserFailure(error.message))

      
    }

  }

  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch('/api/auth/signout', {
        method: 'GET', // Assuming signout is a POST request
        credentials: 'same-origin' // Ensure cookies are sent with the request
      });
  
      if (res.redirected) {
        setAvatarUrl('');
        window.location.href = res.url; // Redirect to the URL provided by the server
        return;
      }
  
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.error)); // Assuming error message is in data.error
        return;
      }
    
  
      dispatch(signoutUserSuccess(data));
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }
  };

  const handleShowListings=async()=>{
    try {
      setshowlistingerror(false)
      const res =await fetch(`/api/user/listings/${currentUser._id}`)
      const data=await res.json()

      if(data.success===false){
        setshowlistingerror(true)
        return
      }

      setuserListing(data)



      
    } catch (error) {
      setshowlistingerror(true)
      
    }
  }

  const handleListingDelete=async(listingId)=>{


    try {

      const res=await fetch(`/api/listing/delete/${listingId}`,{
        method:'DELETE',

      })


      const data=await res.json();
      if(data.success===false){
        console.log(data.message)
        return;
      } 

      setuserListing((prev)=>prev.filter((listing)=>listing._id!==listingId))



      
    } catch (error) {

      console.log(error.message)
      
    }

  }
  return (
    <div className='p-3 max-w-lg mx-auto mt-7'>
      <h1 className='text-3xl font-semibold text-center'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-3'>
        <input onChange={handleFileChange}  type="file" ref={fileref} hidden accept='image/*' />
        <img  onClick={() => fileref.current.click()} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={formdata.avatar || currentUser.avatar} alt="profile" />


        <p className='text-sm self-center'>
  {fileerror ? (
    <span className='text-red-700'>Error image upload (image must be less than 2mb)</span>
  ) : (
    fileper > 0 && fileper < 100 ? (
      <span className='text-slate-700'>Uploading {fileper}%</span>
    ) : fileper === 100 && imageUploaded ? (
      <span className='text-green-700'>Image Successfully Uploaded</span>
    ) : null
  )}
</p>




        <input type="username"  onChange={handleChange} defaultValue={currentUser.username} id='username' placeholder='username' value={formdata.username} className='border p-3 rounded-lg' />
        <input type="email" onChange={handleChange} defaultValue={currentUser.email} id='email' placeholder='email' value={formdata.email} className='border p-3 rounded-lg' />
        <input type="password" id='password' placeholder='password' value={formdata.password} className='border p-3 rounded-lg' />
        <button disabled={loading} onClick={handleSubmit} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading?'Loading...':'update'}</button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={'/create-listing'}>
          Create Listing
        </Link>
      </form>

      {updatestate? <p className='text-green-700 mt-2'>Updated Succesfully</p>:null}
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer font-semibold'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer font-semibold'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error?error:""}</p>

      <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'>{showlistingerror ?"Eroor showing Listigs":""}</p>


      {userListing && userListing.length > 0 &&


    <div className='flex flex-col'>
      <h1 className='text-center mt-7 mb-4 text-3xl font-semibold' >Your Listings</h1>


      {userListing.map((listing) => (
        <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
          <Link to={`/listings/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="listing cover" className='h-16 w-16 object-contain   ' />
          </Link>
    
          <Link className='flex-1' to={`/listings/${listing._id}`}>
    
    
            <p className='text-slate-700 font-semibold  hover:underline truncate'>{listing.name}</p>
          </Link>
    
          <div className='flex flex-col items-center'>
    
            <button onClick={()=>handleListingDelete(listing._id)}  className='text-red-700 uppercase'>Delete</button>

            <Link to={`/update-listing/${listing._id}`}>
            <button className='text-green-700 uppercase'>Edit</button>
            </Link>
    
          </div>
        </div>
      ))}
    </div>
}

    </div>
  );
}

export default Profile;
