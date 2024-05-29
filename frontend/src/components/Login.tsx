import { FaMap, FaUser, FaUsers } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

function Login() {
	return (
		<div className="container mx-auto flex justify-center">
			<div className="w-1/3">
				<form>
					<div className="text-center">
						<h1 className="text-2xl font-bold">Login</h1>
					</div>
					<button className="btn btn-primary flex items-center w-full justify-center py-2 mt-4 bg-blue-500 text-white rounded">
						<div className="mr-3 flex items-center">
							<FcGoogle />
						</div>
						<div className="min-w-10"></div>
						<div>Continue With Google</div>
					</button>
					<hr className="my-4" />
					<div className="form-group my-3">
						<label
							htmlFor="inputEmail"
							className="block text-sm font-medium "
						>
							Email address
						</label>
						<input
							type="email"
							className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							id="inputEmail"
							placeholder="Enter email"
						/>
					</div>
					<div className="form-group my-3">
						<label
							htmlFor="inputPassword"
							className="block text-sm font-medium"
						>
							Password
						</label>
						<input
							type="password"
							className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							id="inputPassword"
							placeholder="Password"
						/>
					</div>

					<div className="flex justify-around items-center">
						<Link to="/signup">
							<button className="btn btn-primary bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
								Sign Up
							</button>
						</Link>
						<button
							type="submit"
							className="btn btn-primary bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
