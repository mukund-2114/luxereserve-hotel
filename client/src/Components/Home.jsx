import React, { useEffect, useState } from 'react'
import axios, { all } from 'axios'
import { Link } from 'react-router-dom'

const Home = () => {
  const [allPlaces, setallPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    axios.get('/allPlaces').then((response) => {
      setallPlaces(response.data)
      setLoading(false)
    })
  }, [])
  if (loading) {
    return "Data Loading"
  }
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 md:px-16 lg:px-24 xl:px-72 gap-4 mt-8 gap-y-8'>
      {allPlaces.length > 0 && allPlaces.map((place, index) => (
        <Link key={index} to={'/singlePlace/' + place._id}>
          <img src={place.photos[0]?.startsWith('http') ? place.photos[0] : `http://localhost:3000/uploads/` + place.photos[0]} alt="" className='object-cover h-72 rounded-lg hover:scale-105  transition-all duration-300 cursor-pointer' />
          <h2 className='mt-4 font-semibold'>{place.title}</h2>
          <p className='text-sm'>{place.address}</p>
          <h2 className='font-semibold text-sm '>$ {place.price} CAD per night</h2>
        </Link>
      ))}
    </div>
  )
}

export default Home