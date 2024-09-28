import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

function Login() {
	const [token, setToken] = useState<string | null>(null);
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');


	const handleLogin = async () => {

		try {
			// Redirect to the backend to initiate Google OAuth
			window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https://lookoutcapstone.xyz/api/auth/signup/google&response_type=code&client_id=456933252122-r308hq3v8185kb9k4k9cma7q05afbejq.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline";

			localStorage.setItem('authToken', "Google Signup");


		} catch (error) {
			navigate("/login");
			console.error("Error during login:", error);
		}
	};



	useEffect(() => {
		if (token !== "" && token !== null) {
			navigate("/home");
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
		<div className="flex items-center justify-center min-h-screen p-4">
			<div className="w-full max-w-md p-8 space-y-8 rounded-lg border">
				<div className="text-center mb-2">
					<h1 className="text-2xl font-bold">Login</h1>
				</div>

				<hr></hr>
				{/* <div className="flex justify-center mb-2">
					<div className="w-56 h-56 flex items-center justify-center">
					<img src="/logo.png" alt="Logo" />
					</div>
				</div> */}

				<form className="mt-1 space-y-4">
					<div>
						<label
							htmlFor="inputEmail"
							className="block text-sm font-medium text-content"
						>
							Email address
						</label>
						<input
							type="email"
							className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-navBkg"
							id="inputEmail"
							placeholder="Enter email"
							value={email}
							onChange={(e) => setEmail(DOMPurify.sanitize(e.target.value))}
							required
						/>
					</div>
					<div>
						<label
							htmlFor="inputPassword"
							className="block text-sm font-medium text-content"
						>
							Password
						</label>
						<input
							type="password"
							className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-navBkg"
							id="inputPassword"
							placeholder="Enter Password"
							value={password}
							onChange={(e) => setPassword(DOMPurify.sanitize(e.target.value))}
							required
						/>
					</div>
					<div className="flex justify-around items-center">
						<button
							type="submit"
							className="w-full px-4 py-2 text-txtBtn bg-navBkg rounded-md hover:bg-txtBtn hover:border-navBkg hover:text-navBkg border border-navBkg"
							onClick={handleSubmit}
						>
							Login
						</button>
					</div>
				</form>

				<div className="flex items-center my-2">
					<hr className="flex-grow border-gray-300" />
					<span className="px-3 text-content whitespace-nowrap">OR CONTINUE WITH</span>
					<hr className="flex-grow border-gray-300" />
				</div>

				<div className="flex justify-center mb-2">
					<button className="w-full py-2 text-content bg-white-500 rounded-md hover:bg-navBkg hover:border-navBkg hover:text-white focus:outline-none flex items-center justify-center border border-gray-300"
						onClick={handleLogin}
					>
						<FcGoogle size={20} style={{ marginRight: 10 }} />
						Sign in with Google
					</button>

				</div>

				<div className="text-center mt-4">
					<span className="text-sm text-content">Don't have an account? </span>
					<Link to="/signup" className="text-sm text-content underline hover:text-navBkg">
						Signup
					</Link>
				</div>

			</div>
		</div>
	);
}

export default Login;