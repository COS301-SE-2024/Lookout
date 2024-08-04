import React, { useEffect, useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

const SignUpScreen = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
		if (token !== "" && token !== null) {
			navigate("/");
			window.location.reload();
		}
	}, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          userName:email,
          passcode: password,
          role: "ADMIN"
        }),
      });

      if (!response.ok) {
        throw new Error('Signup failed!');
      }

      const data = await response.json();
		  localStorage.setItem('authToken', data.token);
		  localStorage.setItem('userEmail', email);
		  setToken(data.token);
    } catch (error) {
      console.error('Error:', error);
      setError('Signup failed');
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <div className="w-56 h-56 flex items-center justify-center">
          <img src="/logo.png" alt="Logo" />
          </div>
        </div>
        <div className="flex justify-center">
          <button className="w-full py-2 text-black bg-white-500 rounded-full hover:bg-gray-300 focus:outline-none flex items-center justify-center border border-gray-300">
		    <FcGoogle size={20} style={{marginRight: 10}} />
            Sign Up with Google
          </button>
        </div>
        <div className="flex items-center justify-center my-4">
          <hr className="w-full border-gray-300" />
          <span className="px-3 text-gray-500">or</span>
          <hr className="w-full border-gray-300" />
        </div>
        <form className="mt-2 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-[#6A994E] rounded-full hover:bg-green-600 focus:outline-none"
            >
              Sign Up
            </button>
          </div>
          <div className="text-center">
            Already have an account? <Link to="/login" className="text-blue-500">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpScreen;
