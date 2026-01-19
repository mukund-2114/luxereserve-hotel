import React, { useContext, useEffect, useState } from 'react'
import Perks from '../Components/Perks';
import axios from 'axios'
import { UserContext } from '../UserContext';
import { Navigate, useParams } from 'react-router-dom';

const AddPlace = () => {
    const { id } = useParams()

    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [photoLink, setPhotoLink] = useState('');
    const [addedPhotos, setaddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(0);
    const [redirect, setRedirect] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);


    useEffect(() => {
        if (id) {
            axios.post('/places/id', { id }).then((response) => {
                const { title, address, photos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = response.data[0];
                setTitle(title);
                setAddress(address);
                setaddedPhotos(photos);
                setDescription(description);
                setPerks(perks);
                setExtraInfo(extraInfo);
                setCheckIn(checkIn);
                setCheckOut(checkOut);
                setMaxGuests(maxGuests);
                setPrice(price)
            })
        }
    }, [])
    const addLinkPhoto = async (e) => {
        e.preventDefault();
        let filename;
        const { data } = await axios.post('/uploads', { link: photoLink })
        filename = data.newName;
        setaddedPhotos(prev => {
            return [...prev, filename]
        })
        setPhotoLink('')
    }

    const uploadPhotos = (e) => {
        const files = e.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        axios.post('/upload-files', data, {
            headers: { 'Content-type': 'multipart/form-data' }
        }).then(response => {
            const { data: filenames } = response;
            setaddedPhotos(prev => {
                return [...prev, ...filenames]
            })
        })
    }

    const removePhoto = (photo) => {
        setaddedPhotos([...addedPhotos.filter(image => image !== photo)])
    }

    const savePlace = async (e) => {
        e.preventDefault();
        // console.log(first)
        if (id) {
            const placeData = {
                id,
                title, address, addedPhotos, description, price
                , perks, extraInfo, checkIn, checkOut, maxGuests
            }

            const response = await axios.put('/places', placeData);
            console.log(response)
            if (response.status === 200) {
                alert('Place updated successfully')
                setRedirect(true)
            }
            else {
                alert(response.data.message)
            }

        }
        else {

            const placeData = {
                title, address, addedPhotos, description, price
                , perks, extraInfo, checkIn, checkOut, maxGuests
            }
            try {
                const response = await axios.post('/places', placeData);
                if (response.status === 201) {
                    alert('Place saved successfully')
                    setRedirect(true)
                }
            }
            catch (err) {
                alert(err);
            }
        }
    }

    if (redirect) {
        return <Navigate to='/account/places' />
    }

    return (
        <div className='mx-auto w-6/12 mt-8'>

            <h2 className='text-2xl mt-4'>Title</h2>
            <p className='text-sm text-gray-500'>Title for your place</p>
            <input type="text" placeholder='Enter the title of your place' className='w-full border rounded-2xl px-4 py-1' onChange={e => setTitle(e.target.value)} value={title} />
            <h2 className='text-2xl mt-4'>Address</h2>
            <p className='text-sm text-gray-500'>Address to this place</p>
            <input type="text" placeholder='Enter the address of your place' className='w-full border rounded-2xl px-4 py-1' onChange={e => setAddress(e.target.value)} value={address} />
            <h2 className='text-2xl mt-4'>Photos</h2>
            <div className='flex items-center gap-2'>
                <input type="text" placeholder='Add photo using link' className=' border rounded-2xl px-4 py-1 w-full' onChange={e => setPhotoLink(e.target.value)} value={photoLink} />
                <button className='bg-gray-300 rounded-full w-32 px-2 py-1' onClick={addLinkPhoto}>Add Photo</button>
            </div>
            <div className='grid md:grid-cols-4 lg:grid-cols-6 grid-cols-3 gap-2'>

                {addedPhotos.length > 0 && addedPhotos.map((photo, index) => (
                    <div
                        key={index}
                        className='relative cursor-move'
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData('imageIndex', index);
                        }}
                        onDragOver={(e) => {
                            e.preventDefault(); // Necessary to allow dropping
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            const draggedIndex = e.dataTransfer.getData('imageIndex');
                            const dropIndex = index;

                            if (draggedIndex === "") return; // dragging something else?

                            const parsedDraggedIndex = parseInt(draggedIndex);
                            if (parsedDraggedIndex === dropIndex) return;

                            const newPhotos = [...addedPhotos];
                            const [reorderedItem] = newPhotos.splice(parsedDraggedIndex, 1);
                            newPhotos.splice(dropIndex, 0, reorderedItem);

                            setaddedPhotos(newPhotos);
                        }}
                    >
                        <img
                            src={photo.startsWith('http') ? photo : `https://luxereserve-hotel-api.onrender.com/uploads/` + photo}
                            alt=""
                            className='rounded-2xl mt-4 h-28 w-96 object-cover bg-gray-200 cursor-pointer hover:opacity-90 transition-opacity'
                            onClick={() => setSelectedPhoto(photo)}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute right-3 bottom-3 p-0.5 cursor-pointer bg-white rounded-2xl" onClick={() => { removePhoto(photo) }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>

                    </div>

                ))}

                <label className='border bg-transparent cursor-pointer rounded-2xl p-8 flex justify-center items-center gap-2 mt-4'>
                    <input type="file" multiple hidden onChange={uploadPhotos} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    Upload
                </label>
            </div>
            <h2 className='text-2xl mt-4'>Description</h2>
            <p className='text-sm text-gray-500'>Description for your place</p>
            <textarea name="" id="" className='' rows="5" onChange={e => setDescription(e.target.value)} value={description}></textarea>
            <Perks selected={perks} onChange={setPerks} />
            <h2 className='text-2xl mt-4'>Extra Info</h2>
            <p className='text-sm text-gray-500'>Add extra info for your place</p>
            <textarea name="" id="" className='' rows="2" onChange={e => setExtraInfo(e.target.value)} value={extraInfo}></textarea>

            <h2 className='text-2xl mt-4'>Check In & Check Out</h2>
            <p className='text-sm text-gray-400'>Enter the specific times for check-in and check-out (use 24-hour format, e.g., 14 for 2 PM). Also specify how many guests can stay.</p>

            <div className='grid lg:grid-cols-4  gap-3'>
                <div>
                    <h2>Check in</h2>
                    <input type="time" className='w-full border rounded-2xl px-4 py-1' onChange={e => setCheckIn(e.target.value)} value={checkIn} />
                </div>
                <div>
                    <h2>Check out</h2>
                    <input type="time" className='w-full border rounded-2xl px-4 py-1' onChange={e => setCheckOut(e.target.value)} value={checkOut} />
                </div>
                <div>
                    <h2>Max Guests</h2>
                    <input type="number" className='w-full border rounded-2xl px-4 py-1' onChange={e => setMaxGuests(e.target.value)} value={maxGuests} />
                </div>
                <div>
                    <h2>Price</h2>
                    <input type="number" className='w-full border rounded-2xl px-4 py-1' onChange={e => setPrice(e.target.value)} value={price} />
                </div>
            </div>
            <button className='bg-primary rounded-full px-4 py-2 text-white w-full my-5' onClick={savePlace}>Save</button>

            {selectedPhoto && (
                <div className='fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50' onClick={() => setSelectedPhoto(null)}>
                    <div className='relative max-w-4xl max-h-screen p-4'>
                        <button onClick={() => setSelectedPhoto(null)} className='absolute -top-2 -right-2 bg-gray-500 text-white rounded-full p-1 cursor-pointer hover:bg-black'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img src={selectedPhoto.startsWith('http') ? selectedPhoto : `https://luxereserve-hotel-api.onrender.com/uploads/` + selectedPhoto} alt="Full size" className='max-h-[90vh] max-w-full rounded-2xl object-contain' onClick={(e) => e.stopPropagation()} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddPlace