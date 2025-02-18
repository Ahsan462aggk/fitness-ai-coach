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
  let router = useRouter();
  const { handleLogin } = useAuth();

  const handleLoginFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Clear any previous error messages
    setError('');
    setSuccessMessage(null);

    // Set up the request body with the expected parameters
    const requestBody = new URLSearchParams();
    requestBody.append('grant_type', 'password'); // Specific to your backend request
    requestBody.append('username', email); // Email as the username
    requestBody.append('password', password); // Password
    requestBody.append('scope', 'openid'); // You can adjust the scope if needed
    requestBody.append('client_id', 'your-client-id'); // Your client ID
    requestBody.append('client_secret', 'your-client-secret'); // Your client secret

    try {
      // Send a POST request to the backend with form data
      const response = await axios.post('http://127.0.0.1:8000/users/login', requestBody);

      // Handle successful login
      if (response.status === 200) {
        // Save the access token to local storage
        localStorage.setItem('token', response.data.access_token);
        const userData = { name: email };
        localStorage.setItem('userData', JSON.stringify(userData));
        handleLogin(email); // Update the Auth Context state

        setSuccessMessage('Login successful! Redirecting...');
        toast.success('login successful');
        router.push('/dashboard');
        // Redirect or do something after a successful login
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
      } else if (response.status === 401) {
        toast.error('invalid credentials');
      }
    } catch (err) {
      // Handle error (invalid credentials, etc.)
      setError('Invalid credentials or server error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center transition-all duration-500 ease-in-out transform">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md transform transition-all duration-500 opacity-0 animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 animate-slide-in-from-left">Login to Your Account</h2>

        {/* Display success message if available */}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        {/* Display error message if available */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLoginFormSubmit} className="space-y-6">
          <div className="animate-slide-in-from-left">
            <label htmlFor="email" className="text-lg font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 p-4 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
              required
            />
          </div>
          <div className="animate-slide-in-from-left delay-200">
            <label htmlFor="password" className="text-lg font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 p-4 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:text-blue-700">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
