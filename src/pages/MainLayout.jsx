import React from 'react';
import PersistentDrawerLeft from '../components/drawer';

export default function MainLayout() {
  return (
    <div className='w-full h-screen flex flex-col '>
      <div className="flex-grow">
        <PersistentDrawerLeft />
      </div>
    </div>
  );
}
