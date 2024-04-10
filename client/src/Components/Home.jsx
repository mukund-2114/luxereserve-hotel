import React, { useEffect, useState } from 'react'
import axios, { all } from 'axios'
import { Link } from 'react-router-dom'

const Home = () => {
  const [allPlaces, setallPlaces] = useState([])
  useEffect(()=>{
    axios.get('/allPlaces').then((response)=>{
        setallPlaces(response.data)
    }).catch((error)=>{console.log("mukud",error)});
  },[])
  console.log(allPlaces)
  return (
    <div className='grid lg:grid-cols-4 px-72 gap-4 mt-8 gap-y-8'>
        {allPlaces?.length > 0 && allPlaces?.map((place,index)=>(
          <Link key={index} to={'/singlePlace/'+place._id}>
              <img src={`https://luxereserve-hotel-api.onrender.com/uploads/`+place.photos[0]} alt="" className='object-cover h-72' />
              <h2 className='mt-4 font-semibold'>{place.title}</h2>
              <p className='text-sm'>{place.address}</p>
              <h2 className='font-semibold text-sm '>$ {place.price} CAD per night</h2>
          </Link>
        ))}
    </div>
  )
}

export default Home