import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {Swiper,SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import ListingItems from '../components/ListingItems'
const Home = () => {

  SwiperCore.use([Navigation])
  const [offerlisting, setofferlisting] = useState([])
  const [salelisting, setsalelisting] = useState([])
  const [rentlisting, setrentlisting] = useState([])
  console.log(salelisting)
  useEffect(() => {
    const fetchofferlisting = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setofferlisting(data);
        fetchrentlisting(); // After setting offer listings, fetch rent listings
      } catch (error) {
        console.log(error);
      }
    };
  
    const fetchrentlisting = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setrentlisting(data);
        fetchsalelisting(); // After setting rent listings, fetch sale listings
      } catch (error) {
        console.log(error);
      }
    };
  
    const fetchsalelisting = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setsalelisting(data); // Set sale listings
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchofferlisting(); // Trigger the fetch for offer listings after component mounts
  }, []);
  
  


  return (
  <div >
    {/* top side */}
    <div className='flex flex-col gap-10 py-28 px-3 max-w-6xl mx-auto'>
      <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
        Find your next <span className='text-slate-500'>perfect</span>
         <br />place with ease
      </h1>

    <div className='text-gray-400 text-xs sm:text-sm'>
      BrickEstate is the best place to find your next perfect place to live
      <br />
      we have wide range of property for you to choose
    </div>
    <Link to={'/search'} className='text-xs  sm:text-sm text-blue-800 font-bold hover:underline'>
      Let's get started
    </Link>

    </div>

    {/* swiper */}
    <Swiper navigation>

    {offerlisting && offerlisting.length>0 && (
      offerlisting.map((listing)=>(
        <SwiperSlide>

          <div style={{background:`url(${listing.imageUrls[0]}) center no-repeat` ,backgroundSize:'cover'}} className='h-[500px]' key={listing._id}></div>

        </SwiperSlide>

      ))
    )}  
    </Swiper>

    {/* listing resullt for sale offer rent */}

    <div className='max-w-7xl mx-auto flex flex-col gap-8 my-10'>
      {offerlisting &&  offerlisting.length>0 && (
         <div>
          <div className='my-3'>
            <h2 className='text-2xl font-semibold text-slate-600  '>Recent offers</h2>
            <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {
            offerlisting.map((listing)=>(
              <ListingItems listing={listing} key={listing._id} />
            ))
          }

          </div>
         </div>
      )}
      {rentlisting &&  rentlisting.length>0 && (
         <div>
          <div className='my-3'>
            <h2 className='text-2xl font-semibold text-slate-600  '>Places for Rent</h2>
            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {
            rentlisting.map((listing)=>(
              <ListingItems listing={listing} key={listing._id} />
            ))
          }

          </div>
         </div>
      )}
      {salelisting &&  salelisting.length>0 && (
         <div>
          <div className='my-3'>
            <h2 className='text-2xl font-semibold text-slate-600  '>Places for Sale</h2>
            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {
            salelisting.map((listing)=>(
              <ListingItems listing={listing} key={listing._id} />
            ))
          }

          </div>
         </div>
      )}
      

    </div>




    {/* bottom */}
  </div>
  )
}

export default Home