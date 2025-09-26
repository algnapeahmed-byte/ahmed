
import React from 'react';
import { HeartIcon } from './Icons';

function Header() {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm shadow-lg w-full">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <HeartIcon />
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wider mx-4">
          احضن حبيبك
        </h1>
        <HeartIcon />
      </div>
    </header>
  );
}

export default Header;
