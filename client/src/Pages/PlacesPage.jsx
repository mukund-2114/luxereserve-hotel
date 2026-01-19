import React, { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import AddPlace from '../Components/AddPlace';
import axios from 'axios';

const PlacesPage = () => {
    const { action, id } = useParams();
    const [places, setPlaces] = useState([])
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        axios.get('/places').then((response) => {
            setPlaces(response.data)
        })
    }, [])

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this place?")) {
            try {
                await axios.delete(`/places/${id}`);
                setPlaces(places.filter(place => place._id !== id));
            } catch (error) {
                console.error("Error deleting place:", error);
                alert("Failed to delete place");
            }
        }
    }

    console.log(action)

    return (
        <>

            {action !== 'new' && (
                <div className='text-center mt-8'>
                    <Link className='bg-primary px-6 py-2 text-white rounded-full inline-flex gap-1' to='/account/places/new'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add new place</Link>
                </div>
            )
            }
            {(action == 'new' || action == 'id') && <AddPlace />}
            {(action !== 'new' && action !== 'id') && (

                places.length > 0 && places.map((place, index) => (
                    <div className='mx-auto w-8/12 mt-8 border p-2 relative' key={index}>
                        <button className='absolute right-2 top-2 bg-red-500 text-white p-2 rounded-full cursor-pointer z-10' onClick={() => handleDelete(place._id)} title="Delete place">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                        <Link to={`/account/places/id/` + place._id} className='flex gap-4' >
                            <div className='' style={{ maxWidth: '200px', minHeight: '150px' }}>
                                <img src={place.photos[0]?.startsWith('http') ? place.photos[0] : `https://luxereserve-hotel-api.onrender.com/uploads/${place.photos[0]}`} alt="" className='w-full h-full' />
                            </div>
                            <div>
                                <h4 className='text-xl font-semibold'>{place.title}</h4>
                                <p className='mt-3'>{place.description}</p>
                            </div>
                        </Link>
                    </div>
                ))
            )}



        </>
    )
}

export default PlacesPage