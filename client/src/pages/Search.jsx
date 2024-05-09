import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import ListingItems from '../components/ListingItems'

const Search = () => {

    const navigate=useNavigate()
    const [sidebardata, setsidebardata] = useState({
        searchTerm:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
        order:'desc',
    })

    const [loading, setloading] = useState(false)
    const [listing, setlisting] = useState([])
    const [showmore, setshowmore] = useState(false)
   

    const handleChange = (e) => {
        const { id, type, checked, value } = e.target;
      
        if (id === 'all' || id === 'rent' || id === 'sale') {
          // Update type based on checkbox id
          setsidebardata({ ...sidebardata, type: id });
        } else if (id === 'searchTerm') {
          // Update searchTerm based on input value
          setsidebardata({ ...sidebardata, searchTerm: value });
        } else if (id === 'parking' || id === 'furnished' || id === 'offer') {
          // Update checkbox state based on checked value
          setsidebardata({ ...sidebardata, [id]: checked });
        } else if (id === 'sort_order') {
          // Update sort and order based on dropdown value
          const [sort, order] = value.split('_');
          setsidebardata({ ...sidebardata, sort, order });
        }
      };


      const handleSubmit=(e)=>{
        e.preventDefault()
        const urlParams=new URLSearchParams()
        urlParams.set('type',sidebardata.type)
        urlParams.set('parking',sidebardata.parking)
        urlParams.set('searchTerm',sidebardata.searchTerm)
        urlParams.set('furnished',sidebardata.furnished)
        urlParams.set('offer',sidebardata.offer)
        urlParams.set('sort',sidebardata.sort)
        urlParams.set('order',sidebardata.order)

        const searchQuery=urlParams.toString()

        navigate(`/search?${searchQuery}`)

      }
      useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
      
        const searchTermFromUrl = urlParams.get('searchTerm') || '';
        const typeFromUrl = urlParams.get('type') || 'all';
        const parkingFromUrl = urlParams.get('parking') === 'true';
        const furnishedFromUrl = urlParams.get('furnished') === 'true';
        const offerFromUrl = urlParams.get('offer') === 'true';
        const sortFromUrl = urlParams.get('sort') || 'created_at';
        const orderFromUrl = urlParams.get('order') || 'desc';
      
        setsidebardata({
          searchTerm: searchTermFromUrl,
          type: typeFromUrl,
          parking: parkingFromUrl,
          furnished: furnishedFromUrl,
          offer: offerFromUrl,
          sort: sortFromUrl,
          order: orderFromUrl,
        });


        const fetchlistings=async()=>{
            setshowmore(false)
            setloading(true)
            const searchQuery=urlParams.toString()
           
            const res=await fetch(`/api/listing/get?${searchQuery}`)
            const data=await res.json()
            if(data.length>7){
              setshowmore(true)

            }
            else{
              setshowmore(false)
            }
            setlisting(data)
            setloading(false)


        }
        fetchlistings()
      }, [location.search]);


      const onshowmoreclick=async()=>{
        const numberoflisting=listing.length;
        const startindex=numberoflisting;
        const urlParams=new URLSearchParams(location.search)
        urlParams.set('startIndex',startindex)
        const searchQuery=urlParams.toString()
        const res=await fetch(`/api/listing/get?${searchQuery}`)
        const data=await res.json();
        if(data.length<8){
          setshowmore(false)

        }
        setlisting([...listing,...data])

      }
      
      
      
  return (
    <div className='flex flex-col md:flex-row'>

        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>

            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>

                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold' >Search Term :</label>
                    <input className='border rounded-lg p-3 w-full ' value={sidebardata.searchTerm}  onChange={handleChange} id='searchTerm' placeholder='Search.. ' type="text" />
                </div>

                <div className='flex gap-2 flex-wrap items-center '>
                    <label className='font-semibold' >Type:</label>
                    <div className='flex gap-2'><input type="checkbox" id="all" className='w-5'  checked={sidebardata.type==='all'} onChange={handleChange} />
                    <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'><input type="checkbox" id="rent" className='w-5' onChange={handleChange} checked={sidebardata.type==='rent'} />
                    <span>Rent</span>
                    </div>
                    <div className='flex gap-2'><input type="checkbox" id="sale" className='w-5' onChange={handleChange} checked={sidebardata.type==='sale'} />
                    <span>Sale</span>
                    </div>
                    <div className='flex gap-2'><input type="checkbox" id="offer" className='w-5' onChange={handleChange} checked={sidebardata.offer} />
                    <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap items-center '>
                    <label className='font-semibold' >Amenities:</label>
                    <div className='flex gap-2'><input type="checkbox" id="parking" className='w-5' onChange={handleChange} checked={sidebardata.parking}/>
                    <span>Parking</span>
                    </div>
                    <div className='flex gap-2'><input type="checkbox" id="furnished" className='w-5'onChange={handleChange} checked={sidebardata.furnished} />
                    <span>Furnished</span>
                    </div>
                    
                </div>

                <div className="flex items-center gap-2">

                    <label className='font-semibold' >Sort :</label>
                    <select onChange={handleChange}  defaultValue={'created_at_desc'} id="sort_order" className='border rounded-lg p-3'>

                        <option value='regularPrice_desc' >Price high to low</option>
                        <option value='regularPrice_asc'>Price low to high</option>
                        <option value='createdAt_desc' >latest</option>
                        <option  value='createdAt_asc' >oldest</option>
                    </select>

                </div>

                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
                
            </form>
        </div>
        <div className='flex-1'>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700  mt-5'>Listing results</h1>

            <div className='p-7 flex flex-wrap gap-4'>
                {!loading && listing.length===0 && (
                    <p className='text-xl text-slate-700'>No listing found!</p>
                )}
                {loading && (
                    <p className='text-xl text-slate-700 text-center w-full'>
                            Loading...
                    </p>
                )}
                {
                    !loading && listing && listing.map((listing)=>(
                        <ListingItems key={listing._id} listing={listing}/>
                    ))
                }
                {showmore && (<button className='text-green-700 hover:underline p-7 text-center w-full' onClick={onshowmoreclick}>
                              Show More

                  </button>)}
            </div>
        </div>

    </div>
  )
}

export default Search