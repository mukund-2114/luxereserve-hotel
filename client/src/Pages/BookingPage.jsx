import axios from 'axios'
import { differenceInDays } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const BookingPage = () => {
    const [bookings, setBookings] = useState([])
    useEffect(() => {
        axios.get('/bookings').then(response => {
            const sortedBookings = response.data.sort((a, b) => b._id.localeCompare(a._id));
            setBookings(sortedBookings)
            // console.log(response.data)
        }).catch(err => console.error(err))
    }, []) // Added dependency array to prevent infinite re-renders
    return (
        <div>

            {
                bookings.length > 0 && bookings.map((booking, index) => {
                    if (!booking.place) return null; // Handle deleted places
                    return (
                        <div className='mx-auto w-8/12 mt-8 border p-2 cursor-pointer' key={index}>
                            <Link to={`/singlePlace/` + booking.place._id} className='flex gap-4' >
                                <div className='' style={{ maxWidth: '200px', minHeight: '150px' }}>
                                    <img src={booking.place.photos[0]?.startsWith('http') ? booking.place.photos[0] : `https://luxereserve-hotel-api.onrender.com/uploads/${booking.place.photos[0]}`} alt="" className='w-full h-full' />
                                </div>
                                <div>
                                    <h4 className='text-xl font-semibold'>{booking.place.title}</h4>
                                    <p className='mt-3 text-sm'>{booking.place.description}</p>
                                    <div className='flex gap-2 text-gray-500'>
                                        <p className='mt-3 flex gap-1'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                            </svg>
                                            {differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn))} nights : </p>
                                        <p className='mt-3 flex gap-1'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                            </svg>

                                            {booking.checkIn}

                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </p>
                                        <p className='mt-3 flex'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                            </svg>
                                            {booking.checkOut}</p>
                                    </div>
                                    <p className='mt-3 flex font-semibold text-lg'>Total Price: $
                                        {booking.price}</p>
                                </div>
                            </Link>
                        </div>


                    )
                })
            }
        </div>
    )
}

export default BookingPage