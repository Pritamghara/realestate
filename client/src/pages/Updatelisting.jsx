import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import app from '../firebase';
import {useSelector} from 'react-redux'
import { useNavigate,useParams } from 'react-router-dom';


const CreateListing = () => {

  const {currentUser} =useSelector((state)=>state.user)
  const [files, setFiles] = useState([]);

  const navigate=useNavigate()
  const param=useParams()
  const [formdata, setFormdata] = useState({
    imageUrls: [],
    name:'',
    description:'',
    address:'',
    type:"rent",
    bedrooms:1,
    bathrooms:1,
    regularPrice:50,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false,



  });

  console.log(formdata)

  const [uploading, setuploading] = useState(false)

  const [imageUploadError, setimageUploadError] = useState(false)
 const [error, seterror] = useState(false)
 const [loading, setloading] = useState(false)

 const [listingupdated, setlistingupdated] = useState(false)
  useEffect(() => {
    const fetchlisting=async()=>{
      const listingId=param.listingId
      const res=await fetch(`/api/listing/get/${listingId}`)
      const data=await res.json();
      if(data.success===false){
        console.log(data.message)

      }
      setFormdata(data)


    }
    fetchlisting()
  }, [])
  
  const handleImageSubmit = (e) => {
    e.preventDefault();
    setuploading(true)
    setimageUploadError(false)

    if (files.length > 0 && files.length +formdata.imageUrls.length < 7) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormdata({ ...formdata, imageUrls: formdata.imageUrls.concat(urls) });
        setimageUploadError(false)
        setuploading(false)
        
      }).catch((err)=>{
        setimageUploadError('Image upload failed (2mb max per image)')
        setuploading(false)
      })
    }
    else{
      setimageUploadError('You can only upload 6 images per listing')
      setuploading(false)
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);

      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
         
          
         
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };


  const handleRemoveImage =(index)=>{

    setFormdata({
      ...formdata,imageUrls:formdata.imageUrls.filter((_,i)=> i !==index),

    })

  }

  const handleChange =(e)=>{

    if(e.target.id==='sale' || e.target.id==='rent'){
      setFormdata({
        ...formdata,type:e.target.id
      })
    }

    if(e.target.id==='parking' || e.target.id==='furnished' || e.target.id=== 'offer'){
      setFormdata({
        ...formdata,[e.target.id]:e.target.checked
      })
    }
    
    
    if(e.target.type==='number' || e.target.type==='text'|| e.target.type==='textarea'){
      
      setFormdata({
        ...formdata,[e.target.id]:e.target.value,
      })
    }



  }

  const handleSubmit=async (e)=>{
    e.preventDefault()

    try {

      if(formdata.imageUrls.length<1){
        return seterror("You must upload 1 image")
      }

      if(+formdata.regularPrice<=formdata.discountPrice){
        return seterror('Discount price must be less than regular price')
      }

      setloading(true)
      seterror(false)

      const res=await fetch(`/api/listing/update/${param.listingId}`,{

        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          ...formdata,userRef:currentUser._id,
        })

      })

      const data=await res.json()

      setloading(false)
      if(data.success===false){
        seterror(data.message)

      }
      setlistingupdated(true)
      navigate(`/listing/${data._id}`)


      
    } catch (error) {

      seterror(error.message)
      setloading(false)
      
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setlistingupdated(false);
    }, 3000); 
    return () => clearTimeout(timer);
  }, [listingupdated]);
  useEffect(() => {
    const timer = setTimeout(() => {
      seterror(false)
    }, 3000); 
    return () => clearTimeout(timer);
  }, [error]);



  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Update a Listing</h1>
      <form onSubmit={handleSubmit} className='flex- flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input className='border p-3 rounded-lg' type="text" placeholder='Name' id='name' maxLength='62' minLength="5" required onChange={handleChange} value={formdata.name} />
          <textarea className='border p-3 rounded-lg' type="text" placeholder='description' id='description'  maxLength={1500} required onChange={handleChange} value={formdata.description} />
          <input className='border p-3 rounded-lg' type="text" placeholder='address' id='address' maxLength='62' minLength={10} required onChange={handleChange} value={formdata.address} />
          <div className='flex gap-10 flex-wrap mt-5'>
            
          <div className='flex gap-2'>
                    <input type="checkbox"  id='sale' className='w-5' onChange={handleChange} checked={formdata.type==="sale"}/>
                    <span className='font-semibold'>Sell</span>
                  </div>
                  <div className='flex gap-2'>
                    <input type="checkbox"  id='rent' className='w-5' onChange={handleChange} checked={formdata.type==='rent'} />
                    <span className='font-semibold'>Rent</span>
                  </div>
                  <div className='flex gap-2'>
                    <input type="checkbox"  id='parking' className='w-5' onChange={handleChange} checked={formdata.parking}/>
                    <span className='font-semibold'>Parking Spot</span>
                  </div>
                  <div className='flex gap-2'>
                    <input type="checkbox"  id='furnished' className='w-5' onChange={handleChange} checked={formdata.furnished}/>
                    <span className='font-semibold'>Furnished</span>
                  </div>
                  <div className='flex gap-2'>
                    <input type="checkbox"  id='offer' className='w-5' onChange={handleChange} checked={formdata.offer}/>
                    <span className='font-semibold'>Offer</span>
                  </div>
          </div>

          <div className='font-semibold flex flex-wrap gap-10 mt-5'>
          <div className='flex items-center gap-2'><input className='p-3 border-gray-300 rounded-lg' type="number" id="bedrooms" min='1' max='10' required onChange={handleChange} value={formdata.bedrooms}/>
                  <p>Beds</p>
                  
                  </div>
                  <div className='flex items-center gap-2'><input className='p-3 border-gray-300 rounded-lg' type="number" id="bathrooms" min='1' max='10' required onChange={handleChange} value={formdata.bathrooms}/>
                  <p>Baths</p>
                  
                  </div>
                  <div className='flex items-center gap-2'>
                    <input className='p-3 border-gray-300 rounded-lg' type="number" id="regularPrice" min='50' max='100000' required onChange={handleChange} value={formdata.regularPrice}/>
                  <div className='flex flex-col items-center'>

                  <p>Regular Price</p>
                  <span className='text-xs'>($/month)</span>
                  </div>
                  
                  </div>


                  { formdata.offer &&(


                  <div className='flex items-center gap-2'>
                    <input className='p-3 border-gray-300 rounded-lg' type="number" id="discountPrice" min='0' max='100000' required onChange={handleChange} value={formdata.discountPrice}/>
                  <div className='flex flex-col items-center'>


                  <p>Discounted Price</p>
                  <span className='text-xs'>($/month)</span>
                  </div>
                  
                  </div>
                  )}

                </div>
          </div>
        

        <div className='flex flex-col flex-1 gap-4 mt-5'>
          <p className='font-semibold'>Images:<span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span></p>
          <div className='flex gap-4'>
            <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id="images" accept='image/*' multiple />
            <button disabled={uploading} type='button'   onClick={handleImageSubmit} className='p-3 border text-green border-green-700 rounded uppercase hover:shadow-lg text-green-700 hover:bg-green-700 hover:text-white transition ease-in duration-300 disabled:opacity-80 hover:transform hover:scale-120'>{uploading?"Uploading...":"Upload"}</button>
          </div>
          <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
          {
  formdata.imageUrls.length > 0 && formdata.imageUrls.map((url, index) => (
      <div key={url} className='flex justify-between p-3 border items-center'>
          <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg'/>
          <button type='button' onClick={()=>handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
          
      </div>
  ))
}

          <button disabled={loading  || uploading} className='mx-auto w-80 p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading?"Updating...":"Update Listing"}</button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
       
      </form>

      {listingupdated && <p className='text-green-700 text-sm '>Listing Created Succesfully</p>}
    </main>
  );
}

export default CreateListing;
