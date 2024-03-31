import React from 'react'

const Perks = ({selected, onChange}) => {
     const handlePerks = (e) => {
          const ifChecked = e.target.checked;
          const checkedName = e.target.name;
          if(ifChecked){
               onChange([...selected, checkedName])
          }
          else{
               onChange([...selected.filter((a)=> a!==checkedName)])
          }
     }
  return (
    <>
        <h2 className='text-2xl mt-4'>Perks</h2>
                        <p className='text-sm text-gray-500'>Select all that suits your place</p>
                        <div className='grid grid-cols-6 lg:grid-cols-3 gap-3'>
                           <label className='border p-4 rounded-2xl flex gap-2'>
                                <input type="checkbox" checked={selected.includes('wifi')} onChange={handlePerks} name='wifi' />
                                <span>Wifi</span>
                           </label>
                           <label className='border p-4 rounded-2xl flex gap-2'>
                                <input type="checkbox" checked={selected.includes('parking')} onChange={handlePerks} name='parking' />
                                <span>Free Parking</span>
                           </label>
                           <label className='border p-4 rounded-2xl flex gap-2'>
                                <input type="checkbox" checked={selected.includes('tv')} onChange={handlePerks} name='tv' />
                                <span>TV</span>
                           </label>
                           <label className='border p-4 rounded-2xl flex gap-2'>
                                <input type="checkbox" checked={selected.includes('pool')} onChange={handlePerks} name='pool' />
                                <span>Swimming Pool</span>
                           </label>
                           <label className='border p-4 rounded-2xl flex gap-2'>
                                <input type="checkbox" checked={selected.includes('pets')} onChange={handlePerks} name='pets' />
                                <span>Pets</span>
                           </label>
                           <label className='border p-4 rounded-2xl flex gap-2'>
                                <input type="checkbox" checked={selected.includes('ac')} onChange={handlePerks} name='ac' />
                                <span>Air conditioning</span>
                           </label>
                        </div>
    </>
  )
}

export default Perks