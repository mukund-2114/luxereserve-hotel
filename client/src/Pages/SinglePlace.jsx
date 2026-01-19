import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Reserve from '../Components/Reserve';

const SinglePlace = () => {
    const { id } = useParams();
    const [place, setPlace] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        axios.post('/places/id', { id }).then((response) => {
            setPlace(response.data[0])
            setLoading(false)
        })
    }, [])

    if (loading || place === null) {
        return "Loading..."
    }
    return (
        <div className='mx-auto w-7/12 mt-8'>
            <h1 className='font-semibold text-3xl'>{place.title}</h1>
            <div className='flex mt-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <p>{place.address}</p>

            </div>

            {/* <div className='mt-4' style={{ height: '450px' }}> */}
            {/* <div>
                    <img src={"https://luxereserve-hotel-api.onrender.com/uploads/" + place.photos[0]} alt="" className='rounded-l-xl h-full' />
                </div>
                <div className='grid lg:grid-cols-2 gap-2'>
                    <img src={"https://luxereserve-hotel-api.onrender.com/uploads/" + place.photos[1]} alt="" className='w-full h-full' />
                    <img src={"https://luxereserve-hotel-api.onrender.com/uploads/" + place.photos[2]} alt="" className='w-full h-full rounded-tr-xl' />
                    <img src={"https://luxereserve-hotel-api.onrender.com/uploads/" + place.photos[3]} alt="" className='w-full h-full' />
                    <img src={"https://luxereserve-hotel-api.onrender.com/uploads/" + place.photos[4]} alt="" className='w-full h-full rounded-br-xl' />
                </div> */}

            {/* <!-- Slider --> */}
            <div className='grid lg:grid-cols-4 gap-2' style={{ height: "250px" }}>
                <img src={place.photos[0]?.startsWith('http') ? place.photos[0] : "https://luxereserve-hotel-api.onrender.com/uploads/" + place.photos[0]} alt="" className='w-full h-[250px]' />
                <img src={place.photos[1]?.startsWith('http') ? place.photos[1] : "https://luxereserve-hotel-api.onrender.com/uploads/" + place.photos[1]} alt="" className='w-full h-[250px]' />
                <img src={place.photos[2]?.startsWith('http') ? place.photos[2] : "https://luxereserve-hotel-api.onrender.com/uploads/" + place.photos[2]} alt="" className='w-full h-[250px]' />
                <img src={place.photos[3]?.startsWith('http') ? place.photos[3] : "https://luxereserve-hotel-api.onrender.com/uploads/" + place.photos[3]} alt="" className='w-full h-[250px]' />
            </div>
            {/* </div> */}


            {/* about section */}
            <div className='main flex gap-2'>
                <div className='w-8/12 mt-8'>
                    <h4 className='font-semibold text-2xl mt-8'>About This Place</h4>
                    <p className='my-8'>{place.description}</p>


                    <hr />
                    <h4 className='font-semibold text-2xl mt-8'>What This Place Offers</h4>
                    <ul className='grid lg:grid-cols-3 capitalize text-center my-8 gap-2'>
                        {place.perks.map(perk => (
                            <li key={perk} className='border rounded-lg p-2'>{perk}</li>
                        ))}
                    </ul>
                    <h4 className='font-semibold text-2xl mt-8'>Other Things To Note</h4>
                    <p className='my-8'>{place.extraInfo}</p>
                    <h4 className='font-semibold text-2xl mt-8'>Timings</h4>
                    <div className='grid lg:grid-cols-3'>
                        <div className='grid place-items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3" />
                            </svg>
                            Check In
                            <span className='font-semibold'>{place.checkIn}</span>
                        </div>
                        <div className='grid place-items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6-6m0 0l6 6m-6-6v12a6 6 0 01-12 0v-3" />
                            </svg>

                            Check Out
                            <span className='font-semibold'>{place.checkOut}</span>
                        </div>
                        <div className='grid place-items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>

                            Max Guests
                            <span className='font-semibold'>{place.maxGuests}</span>
                        </div>
                    </div>
                </div>
                {/* sidebar section */}
                <Reserve place={place} />
            </div>



        </div>
    )
}

export default SinglePlace