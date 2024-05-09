import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper ,SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation } from 'swiper/modules'
import { FaBath, FaChair, FaMapMarkerAlt, FaParking } from 'react-icons/fa';
import { useSelector } from 'react-redux'

import {FaBed} from 'react-icons/fa'
import 'swiper/css/bundle'
import Contact from '../components/Contact'
const Listing = () => {
  SwiperCore.use([Navigation])

    const param=useParams()
    const [listing, setlisting] = useState(null)
    const [loading, setloading] = useState(false)
    const [error, seterror] = useState(false)
    const [contact, setcontact] = useState(false)

    const {currentUser}=useSelector((state)=>state.user)
    useEffect(() => {
      

        const fetchlisting=async()=>{
            try {
              setloading(true)
              const res= await fetch(`/api/listing/get/${param.listingId}`)

              const data=await res.json()
              if(data.success===false){
                seterror(true)
                setloading(false)
                  return;
  
              }
              setlisting(data)
              setloading(false)
              seterror(false)
              
            } catch (error) {
              seterror(true)
              setloading(false)
              
              
            }
          

        }
        fetchlisting()
    },[param.listingId])
    console.log(listing)
  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl'>Something went wrong</p>}
      {listing && !loading && !error && 

          <>
            <div>
            
          <Swiper navigation>

            {listing.imageUrls.map((url)=>(
              <SwiperSlide key={url}>
                <div className='h-[500px]' style={{background:`url(${url}) center no-repeat`, backgroundSize:'cover'}}></div>

              </SwiperSlide>
            ))}

          </Swiper>
        
            </div>
           
  <div className='text-black-700 font-semibold mt-5 p-5 text-4xl mx-auto w-1/2 flex-col gap-7'>
  <p> {listing.name}-$ {listing.regularPrice} /month</p> 

    <p className='flex items-center mt-6 gap-2 text-slate-600 my-2 text-base'>
  <FaMapMarkerAlt className='text-green-700 text-xl '/>
  <span className="text-xl">{listing.address}</span>
    </p>

  <div className='flex gap-4 '>
    <p className='bg-red-900 w-full max-w-[150px] text-white text-center p-1 rounded-md'>
      {listing.type==="rent" ?'For Rent':'For Sale'}
    </p>
    {
      listing.offer && (
        <p className='bg-green-900 w-full max-w-[150px] text-white text-center p-1 rounded-md'>
          ${+listing.regularPrice-+listing.discountPrice} off
        </p>
      )
    }
  </div>
  <p className='text-slate-800 text-lg mt-3'>
    
    <span className='font-bold text-black'>
      Description - </span>{listing.
description}</p>


    <ul className=' text-green-900 font-semibold text-sm flex items-center gap-4 sm:gap-6 mt-3 '>
      <li className='flex items-center gap-1 whitespace-nowrap'>
        <FaBed className='text-lg' />
        {listing.bedrooms>1 ? `${listing.bedrooms} beds `: `${listing.bedrooms} bed` }
      </li>
      <li className='flex items-center gap-1 whitespace-nowrap'>
        <FaBath className='text-lg' />
        {listing.bathrooms>1 ? `${listing.bathrooms} baths `: `${listing.bathrooms} bath` }
      </li>
      <li className='flex items-center gap-1 whitespace-nowrap'>
        <FaParking className='text-lg' />
        {listing.parking ? 'Parking spot ' :'No Parking'}
      </li>
      <li className='flex items-center gap-1 whitespace-nowrap'>
        <FaChair className='text-lg' />
        {listing.furnished ? 'Furnished ' :'Unfurnished'}
      </li>
      
    </ul>


    {currentUser && listing.userRef!==currentUser._id && !contact && (


    <div className='flex items-center justify-center mt-5 '>

    <button onClick={()=>setcontact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 text-sm w-full h-10'>

      Contact landlord

    </button>
    </div>
    ) }
    {contact && <Contact listing={listing}/>}

  </div>


  


           
            </>
      }

      </main>
  )
}

export default Listing