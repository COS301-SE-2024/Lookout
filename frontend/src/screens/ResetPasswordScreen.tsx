import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ResetPasswordScreen = () => {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token'); // Get token from URL query

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [requirements, setRequirements] = useState([
    'At least 8 characters',
    'At least 1 symbol',
    'At least 1 uppercase letter',
    'At least 1 number',
  ]);

  // Password validation function
  const validatePassword = (password: string) => {
    const newRequirements: string[] = [];
    
    if (password.length < 8) {
      newRequirements.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      newRequirements.push('At least 1 uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      newRequirements.push('At least 1 number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newRequirements.push('At least 1 symbol');
    }

    setRequirements(newRequirements);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    validatePassword(passwordValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (requirements.length > 0) {
      setError('Password does not meet all requirements.');
      return;
    }

    try {
      const response = await fetch(`/api/auth/changepassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, passcode: password }),
      });

      if (!response.ok) {
        throw new Error('Password reset failed.');
      }

      alert('Password has been reset successfully');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <h4 className="font-semibold">Password Requirements:</h4>
            <ul className="list-disc list-inside">
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

          {error && <p className="text-red-500">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;
