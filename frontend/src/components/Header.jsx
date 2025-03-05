import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { logout } from '../features/authSlice';
import { toggleTheme } from '../features/themeSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Check user role: if role is "user", show their name/email; otherwise, default to "Admin"
  const greeting = `Welcome back ${user?.name || user?.email}`
      
  return (
    <header className={`
      flex flex-row
      justify-between items-center
      py-4 px-4 sm:py-5 sm:px-8
       shadow-xl
      transition-colors duration-300
      ${isDarkMode 
        ? 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 text-white'
        : 'bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 text-black'
      }
      gap-4
    `}>
      <div
        className={`
          text-sm sm:text-lg md:text-2xl font-semibold tracking-tight truncate
          ${isDarkMode ? 'text-white' : 'text-gray-800'}
        `}
      >
        {greeting}
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <Button
          variant="destructive"
          className={`
            px-3 sm:px-6 py-2 rounded-lg transition-all duration-200
            ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'}
            text-sm sm:text-base
          `}
          onClick={handleLogout}
        >
          Logout
        </Button>

        <Button
          variant="ghost"
          onClick={() => dispatch(toggleTheme())}
          className={`
            rounded-full p-2 sm:p-3 transition-all duration-300
            ${isDarkMode ? 'hover:bg-gray-600 hover:text-white' : 'hover:bg-gray-300'}
          `}
        >
          {isDarkMode ? (
            <Moon size={20} className="transition-transform duration-500" />
          ) : (
            <Sun size={20} className="transition-transform duration-500" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
