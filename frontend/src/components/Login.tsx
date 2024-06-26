import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

function Login() {
	const [token, setToken] = useState<string | null>(null);
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		if (token !== "" && token !== null) {
			navigate("/");
			window.location.reload();
		}
	}, [token, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			email,
			passcode: password,
			}),
		});

		if (!response.ok) {
			throw new Error('Login failed!');
		}

		const data = await response.json();
		localStorage.setItem('authToken', data.token);
		localStorage.setItem('userEmail', email);
		setToken(data.token);
		
		} catch (error) {
		console.error('Error:', error);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center mb-2">
					<h1 className="text-2xl font-bold">Login</h1>
				</div>
				<div className="flex justify-center mb-2">
					<div className="w-56 h-56 flex items-center justify-center">
					<img src="/logo.png" alt="Logo" />
					</div>
				</div>
				<div className="flex justify-center mb-2">
					<button className="w-full py-2 text-black bg-white-500 rounded-full hover:bg-gray-300 focus:outline-none flex items-center justify-center border border-gray-300">
						<FcGoogle size={20} style={{ marginRight: 10 }} />
						Sign in with Google
					</button>
				</div>
				<div className="flex items-center justify-center my-2">
					<hr className="w-full border-gray-300" />
					<span className="px-3 text-gray-500">or</span>
					<hr className="w-full border-gray-300" />
				</div>
				<form className="mt-1 space-y-4">
					<div>
						<label
							htmlFor="inputEmail"
							className="block text-sm font-medium text-gray-700"
						>
							Email address
						</label>
						<input
							type="email"
							className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							id="inputEmail"
							placeholder="Enter email"
							value={email}
              				onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div>
						<label
							htmlFor="inputPassword"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<input
							type="password"
							className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							id="inputPassword"
							placeholder="Password"
							value={password}
              				onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div className="flex justify-around items-center">
						<Link to="/signup" className="w-full">
							<button className="w-full px-4 py-2 text-white bg-[#6A994E] rounded-full hover:bg-green-600 focus:outline-none">
								Sign Up
							</button>
						</Link>
						<button
							type="submit"
							className="w-full px-4 py-2 text-white bg-[#6A994E] rounded-full hover:bg-green-600 focus:outline-none ml-2"
							onClick={handleSubmit}
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
