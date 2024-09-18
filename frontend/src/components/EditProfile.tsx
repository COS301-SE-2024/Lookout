import DOMPurify from "dompurify";
import React, { useState } from "react";
export const EditProfile = () => {
	//const [, setPicture] = useState("");

	const modalStyles = {
		modalContainer:
			"fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-start md:justify-center items-center",
		modalContent:
			"bg-bkg rounded-lg p-8 relative w-11/12 md:w-96 h-full md:h-auto overflow-y-auto",
		closeButton: "absolute top-2 left-2 cursor-pointer",
		closeIcon: "text-gray-500 hover:text-gray-700",
		settingsTitle: "text-xl font-semibold mb-4 ml-8",
		sectionTitle: "text-lg font-semibold mt-4 mb-2",
		logoutButton: "bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full",
		buttonContainer: "flex space-x-4 mt-4"
	};

	// const [temp, setTemp] = useState<Response>();
	// useEffect(() => {
	// 	if (temp === undefined || null) return;
	// 	console.log("temp", temp);
	// }, [temp]);

	const alertUnimplemented = async () => {
		alert("Reset Password unimplemented until auth is fixed");
	};

	const patchNewUsername = async () => {
		const newUsername = inputUsernameValue;

		const url = `api/users/1/update-username`;

		const requestBody = {
			newUsername: newUsername
		};

		try {
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(requestBody)
			});

			// setTemp(response);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const updatedUser = await response.json();
			console.log("User updated successfully:", updatedUser);
		} catch (error) {
			console.error("Error updating user:", error);
		}
	};

	const patchNewEmail = async () => {
		const newEmail = inputEmailValue; // Assuming inputEmailValue is defined and holds the new email value

		const url = `/api/users/1/update-username`;

		const requestBody = {
			newEmail: newEmail
		};

		try {
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(requestBody)
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// Parse the JSON response
			const updatedUser = await response.json();
			console.log("User email updated successfully:", updatedUser);
		} catch (error) {
			// Log detailed error information
		}
	};

	const [inputUsernameValue, setInputUsernameValue] = useState("");
	const handleInputUsernameChange = (event: any) => {
		setInputUsernameValue(DOMPurify.sanitize(event.target.value));
	};
	const [inputEmailValue, setInputEmailValue] = useState("");
	const handleInputEmailChange = (event: any) => {
		setInputEmailValue(DOMPurify.sanitize(event.target.value));
	};

	const saveAndExit = async () => {
		if (
			inputEmailValue !== "" &&
			inputEmailValue !== undefined &&
			inputEmailValue !== null
		)
			patchNewEmail();
		if (
			inputUsernameValue !== "" &&
			inputUsernameValue !== undefined &&
			inputUsernameValue !== null
		)
			patchNewUsername();
		alert("WHEN AUTH FIXED, UPDATE TO DYNAMIC ID's");
	};

	return (
		<>
			<h2 className="text-xl font-bold">Profile</h2>
			<p className="text-sm text-gray-500">This is how others will see you on the site.</p>
			<hr className="mr-8"></hr>
			<div className="flex flex-col items-center mr-4">
				<ul className="w-full">
					<li className="flex flex-col py-2 mr-4">
						<label
							htmlFor="username"
							className=" text-gray-700 font-bold mb-2"
						>
							Username
						</label>
						<input
							type="text"
							id="username"
							name="username"
							placeholder="change your username"
							value={inputUsernameValue}
							onChange={handleInputUsernameChange}
							className="border border-gray-300 rounded-md h-8 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full"
						/>
					</li>
					<p className="text-sm text-gray-500 mb-4 mr-4">This is your public display name that other users will identify you with.</p>

					<li className="flex flex-col py-2 mr-4">
						<label
							htmlFor="email"
							className="block text-gray-700 font-bold mb-2"
						>
							Change Email
						</label>
						<input
							type="text"
							id="email"
							name="email"
							placeholder="change your email"
							value={inputEmailValue}
							onChange={handleInputEmailChange}
							className="border border-gray-300 rounded-md h-8 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full"
						/>
					</li>
					<p className="text-sm text-gray-500 mb-4">This is your email address you use to log in.</p>


					<li className="flex flex-col py-2">
						<div className={modalStyles.buttonContainer}>
							<button
								className="bg-black hover:bg-gray-400 text-white font-bold py-2 px-4 rounded transition ease-in-out"
								onClick={saveAndExit}
							>
								Update Profile
							</button>
							<button
								className="bg-black hover:bg-gray-400 text-white font-bold py-2 px-4 rounded transition ease-in-out"
								onClick={alertUnimplemented}
							>
								Reset Your Password
							</button>
						</div>
					</li>

				</ul>
			</div>
		</>
	);
};
export default EditProfile;
