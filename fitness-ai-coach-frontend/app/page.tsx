// app/page.tsx

import Link from 'next/link';
import Footer from './components/Footer/footer';
import LandingPage from './components/landing_page';
import Image from 'next/image';

const Home = () => {
  return (
    <div className='w-100'>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-700 to-pink-700 relative">
      <div className="text-center text-white px-6 py-12 md:px-12">
        <h1 className="text-4xl font-extrabold leading-tight md:text-5xl mb-4">
          Achieve Your Fitness Goals with AI Trainer
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Personalized workouts, real-time tracking, and expert guidance
        </p>
        <div className="mt-8">
          <Link
            href="/login"
            className="px-6 py-3 bg-yellow-500 text-black rounded-full text-lg font-semibold hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="ml-4 px-6 py-3 bg-transparent border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white hover:text-black transition duration-300 ease-in-out transform hover:scale-105"
          >
            Register
          </Link>
        </div>
        <div className="mt-12">
          <Image
            src="/jogging.jpg"
            alt="Fitness"
            width={500}
            height={300}
            className="rounded-lg shadow-lg transform transition-all duration-500 hover:scale-110"
          />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Home;
