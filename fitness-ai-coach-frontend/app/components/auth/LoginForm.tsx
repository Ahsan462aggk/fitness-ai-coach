'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/context/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const router = useRouter();
  const { handleLogin } = useAuth();

  const handleLoginFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccessMessage(null);

    const requestBody = new URLSearchParams();
    requestBody.append('grant_type', 'password');
    requestBody.append('username', email);
    requestBody.append('password', password);
    requestBody.append('scope', 'openid');
    requestBody.append('client_id', 'your-client-id');
    requestBody.append('client_secret', 'your-client-secret');

    try {
      const response = await axios.post('https://ahsan462agk-fitness-ai-coach.hf.space/users/login', requestBody);

      if (response.status === 200) {
        localStorage.setItem('token', response.data.access_token);
        
        // CREATE the object here
        const userData = { name: email };
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // FIX: Pass the object { name: email }, NOT just the string 'email'
        handleLogin(userData); 

        setSuccessMessage('Login successful! Redirecting...');
        toast.success('Login successful');
        router.push('/dashboard');
        
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
      }
    } catch (err: unknown) { 
      // FIX: Standardizing error handling to avoid "unexpected any"
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        toast.error('Invalid credentials');
      }
      setError('Invalid credentials or server error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center transition-all duration-500 ease-in-out transform">
      {/* Note: Ensure 'animate-fade-in' and 'animate-slide-in' are defined in your tailwind config */}
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md transform transition-all duration-500">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>

        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLoginFormSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-lg font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 p-4 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-lg font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 p-4 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:text-blue-700">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
