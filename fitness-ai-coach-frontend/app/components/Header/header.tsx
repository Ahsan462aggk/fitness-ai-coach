// Header.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { FaDumbbell } from 'react-icons/fa';

const Header = () => {
  const { isLoggedIn, userName, handleLogout } = useAuth();

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <FaDumbbell className="text-3xl text-green-400" />
          <span className="text-2xl font-bold">Al Trainer</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6 items-center">
            <Link href="/" className="hover:text-green-400 transition-colors">
              Home
            </Link>
            {/* <Link href="/about" className="hover:text-green-400 transition-colors">
              About
            </Link> */}

            {/* Protected Routes */}
            {isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="hover:text-green-400 transition-colors"
                >
                  Dashboard
                </Link>
                <Link href="/plan" className="hover:text-green-400 transition-colors">
                  Plan
                </Link>
              </>
            )}

            {/* <Link href="/contact" className="hover:text-green-400 transition-colors">
              Contact
            </Link> */}
          </div>

          {/* Authentication Section */}
          <div className="flex items-center gap-4 ml-6">
            {/* Welcome Message */}
            {isLoggedIn && userName && (
              <span className="text-green-400">Welcome, {userName}!</span>
            )}

            {/* Authentication Buttons */}
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="bg-green-400 text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-green-300 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="border-2 border-green-400 text-green-400 px-6 py-2 rounded-full font-semibold hover:bg-green-400 hover:text-gray-900 transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-400 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
