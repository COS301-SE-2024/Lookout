import DOMPurify from 'dompurify';
import React, { useEffect, useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

const SignUpScreen = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [requirements, setRequirements] = useState([
    "At least 8 characters",
    "At least 1 symbol",
    "At least 1 uppercase letter",
    "At least 1 number",
  ]);

  // Password validation function
  const validatePassword = (password: string) => {
    const newRequirements: string[] = [];
    
    if (password.length < 8) {
      newRequirements.push("At least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      newRequirements.push("At least 1 uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
      newRequirements.push("At least 1 number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newRequirements.push("At least 1 symbol");
    }

    setRequirements(newRequirements);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedPassword = DOMPurify.sanitize(e.target.value);
    setPassword(sanitizedPassword);
    validatePassword(sanitizedPassword); // validate password on every change
  };

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
          userName: username,
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

  useEffect(() => {
    if (token !== "" && token !== null) {
      navigate("/home");
      window.location.reload();
    }
  }, [token, navigate]);

  const handleLogin = async () => {
    try {
      window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https://lookoutcapstone.xyz/api/auth/signup/google&response_type=code&client_id=456933252122-r308hq3v8185kb9k4k9cma7q05afbejq.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline";
      localStorage.setItem('authToken', "Google Signup");
    } catch (error) {
      navigate("/login");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="font-custom flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg border">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold">Create an Account</h1>
        </div>
        <hr></hr>

        <form className="mt-2 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-content">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(DOMPurify.sanitize(e.target.value))}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-navBkg"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-content">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(DOMPurify.sanitize(e.target.value))}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-navBkg"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-content">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-navBkg"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-content">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(DOMPurify.sanitize(e.target.value))}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-navBkg"
            />
          </div>

          <div className="mt-2">
            <h4>Password Requirements:</h4>
            <ul>
              {requirements.length === 0 ? (
                <li className="text-green-500">All requirements met!</li>
              ) : (
                requirements.map((req, index) => (
                  <li key={index} className="text-red-500">
                    {req}
                  </li>
                ))
              )}
            </ul>
          </div>

          {error && <div className="text-red-500">{error}</div>}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-txtBtn bg-navBkg rounded-md hover:bg-txtBtn hover:border-navBkg hover:text-navBkg border border-navBkg"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="flex items-center my-2">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-content whitespace-nowrap">OR CONTINUE WITH</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="flex justify-center">
          <button className="w-full py-2 text-content bg-white-500 rounded-md hover:bg-navBkg hover:border-navBkg hover:text-white focus:outline-none flex items-center justify-center border border-gray-300"
            onClick={handleLogin}
          >
            <FcGoogle size={20} style={{ marginRight: 10 }} />
            Sign in with Google
          </button>
        </div>

        <div className="text-center text-sm">
          Already have an account? <Link to="/login" className="text-sm text-content underline hover:text-navBkg">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
