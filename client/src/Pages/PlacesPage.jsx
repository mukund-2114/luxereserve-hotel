import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AddPlace from '../Components/AddPlace';
import axios from 'axios';


const PlacesPage = () => {
    const { action } = useParams();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await axios.get('/places');
                setPlaces(response.data);
                setLoading(false);
                setError(null); // Reset error state on successful response
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // JWT expired or unauthorized
                    const errorMessage = 'JWT expired. Please log in again.';
                    console.error(errorMessage);
                    setError(errorMessage);
                    window.alert(errorMessage); // Alert the error message
                    navigate('/login')
                    window.location.reload();
                } else {
                    // Other errors
                    const errorMessage = 'Error fetching places. Please try again later.';
                    console.error(errorMessage, error.message);
                    setError(errorMessage);
                    window.alert(errorMessage); // Alert the error message
                }
                setLoading(false); // Set loading state to false on error
            }
        };

        fetchPlaces(); // Call fetchPlaces function when component mounts
    }, []);

    return (
        <>
            {action !== 'new' && (
                <div className='text-center mt-8'>
                    <Link className='bg-primary px-6 py-2 text-white rounded-full inline-flex gap-1' to='/account/places/new'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add new place
                    </Link>
                </div>
            )}

            {action === 'new' && <AddPlace />}

            {action !== 'new' && (
                <div className='mx-auto w-8/12 mt-8'>
                    {loading ? (
                        <p>Loading places...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : places.length > 0 ? (
                        places.map((place, index) => (
                            <div className='border p-2 cursor-pointer' key={index}>
                                <Link to={`/account/places/${place._id}`} className='flex gap-4'>
                                    <div style={{ maxWidth: '200px', minHeight: '150px' }}>
                                        <img src={`http://localhost:3000/uploads/${place.photos[0]}`} alt='' className='w-full h-full' />
                                    </div>
                                    <div>
                                        <h4 className='text-xl font-semibold'>{place.title}</h4>
                                        <p className='mt-3'>{place.description}</p>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No places found.</p>
                    )}
                </div>
            )}
        </>
    );
};

export default PlacesPage;
