import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/themeSlice';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const Header = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  
  return (
    <header className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800 shadow">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Ticket App</h1>
      <button
        onClick={() => dispatch(toggleTheme())}
        className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
      >
        {darkMode ? (
          <SunIcon className="h-6 w-6" />
        ) : (
          <MoonIcon className="h-6 w-6" />
        )}
      </button>
    </header>
  );
};

export default Header;
