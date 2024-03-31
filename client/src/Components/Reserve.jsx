import React, { useContext, useEffect, useState } from 'react'
import { differenceInDays } from 'date-fns'
import axios from 'axios'
import {UserContext} from '../UserContext'
import useRazorpay from "react-razorpay";
import { Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';



const Reserve = ({ place }) => {
    const [Razorpay] = useRazorpay();
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [numberOfGuests, setNumberOfGuests] = useState(1)
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState(0);
    const [redirect, setRedirect] = useState(false)
    const {user} = useContext(UserContext);
    const [loading, setloading] = useState(true)
    
    useEffect(()=>{
        // setFullName(user.name)
        setloading(false)
    },[user])
    let numberOfNights = 0;
    if (checkIn && checkOut) {
        numberOfNights = differenceInDays(new Date(checkOut), new Date(checkIn))
    }

    const makeBooking = async()=>{
        const response = await axios.post('/bookings',{
            place: place._id,checkIn,checkOut,numberOfGuests,fullName,phone,price: numberOfNights*place.price
        })
        if(response.status == 201){
            handlePayment();
        }
        else{
            alert('Please Login first')
        }
    }
    const handlePayment = async () => {
      
        const options = {
          key: "rzp_test_qgPYhnOXjn6T1R", // Enter the Key ID generated from the Dashboard
          amount: place.price*differenceInDays(new Date(checkOut), new Date(checkIn))*100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "Acme Corp",
          description: "Test Transaction",
          handler: function (response) {
            alert('Place booked successfully!!')
            setRedirect(true)
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
      
        const rzp1 = new Razorpay(options);
      
        rzp1.on("payment.failed", function (response) {
          alert(response.error.code);
        });
    
      
        rzp1.open();
      };
      if(redirect){
        return <Navigate to='/account/bookings'/>
      }
      if(loading){
        return "Loading...";
      }
    return (
        <div className='w-4/12 mt-16 rounded-2xl border border-gray-200 h-2/4 p-6'>
            <h2 className='font-bold'>${place.price} CAD per night</h2>
            <div className='mt-4   rounded-lg p-3'>
                <div className='grid grid-cols-2  pb-2'>
                    <label style={{ borderRight: '1px solid black' }} htmlFor='dateInput1' className='block cursor-pointer'>
                        <span className='text-sm'>CHECK-IN</span>
                        <input type="date" id="dateInput1" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                    </label>
                    <label className='ml-2 block cursor-pointer' htmlFor='dateInput2'>
                        <span className='text-sm'>CHECK-OUT</span>
                        <input type="date" id="dateInput2" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                    </label>
                </div>

                <div className='w-full' style={{ borderTop: '1px solid black' }}>
                    <span className='text-sm'>GUESTS</span>
                    <input type="number" value={numberOfGuests} onChange={(e) => setNumberOfGuests(e.target.value)} />
                </div>
                {(checkIn && checkOut && user) && (
                    <>
                        <div className='w-full'>
                            <span className='text-sm' >Full Name</span>
                            <input type="text" value={fullName} onChange={(e)=>setFullName(e.target.value)} />
                        </div>

                        <div className='w-full'>
                            <span className='text-sm' >Phone Number</span>
                            <input type="number" value={phone} onChange={e=> setPhone(e.target.value)}/>
                        </div>
                    </>
                )}
            </div>
            <button className='bg-primary w-full mt-4 px-3 py-2 rounded-lg text-white' onClick={makeBooking}>Reserve</button>
            <div className='flex justify-between my-5'>
                <u>${place.price} x {numberOfNights} nights</u>
                <span>${place.price * numberOfNights}</span>
            </div>

    
        </div>
    )
}

export default Reserve