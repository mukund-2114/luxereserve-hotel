import React, { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import AddPlace from '../Components/AddPlace';
import axios from 'axios';

const PlacesPage = () => {
    const { action,id } = useParams();
    const [places, setPlaces] = useState([])
    const [refresh, setRefresh] = useState(false);

    useEffect(()=>{
            axios.get('/places').then((response)=>{
                setPlaces(response.data)
            })
    },[])
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
        {(action == 'new' || action == 'id') && <AddPlace/>}
        {(action !== 'new' && action!=='id') && (
            
            places.length > 0 && places.map((place,index) =>(
                <div className='mx-auto w-8/12 mt-8 border p-2 cursor-pointer' key={index}>
                    <Link to={`/account/places/id/`+place._id} className='flex gap-4' >
                        <div className='' style={{maxWidth:'200px',minHeight:'150px'}}>
                            <img src={`http://localhost:3000/uploads/${place.photos[0]}`} alt="" className='w-full h-full'/>
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