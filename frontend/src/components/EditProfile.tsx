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
		logoutButton: "bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full"
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
		setInputUsernameValue(event.target.value);
	};
	const [inputEmailValue, setInputEmailValue] = useState("");
	const handleInputEmailChange = (event: any) => {
		setInputEmailValue(event.target.value);
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
			<h2 className={modalStyles.settingsTitle}>Edit Profile</h2>
			<div className="flex flex-col items-center">
				<ul className="w-full">
					<li className="flex flex-col py-2 border-t border-b">
						<label
							htmlFor="username"
							className="block text-gray-700 font-bold mb-2"
						>
							Change Username
						</label>
						<input
							type="text"
							id="username"
							name="username"
							placeholder="change your username"
							value={inputUsernameValue}
							onChange={handleInputUsernameChange}
							className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
						/>
					</li>

					<li className="flex flex-col py-2 border-t border-b">
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
							className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
						/>
					</li>

					<li className="flex flex-col py-2 border-t border-b">
						<button
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
							onClick={alertUnimplemented}
						>
							Reset Password
						</button>
					</li>

					<li className="flex flex-col py-2 border-t border-b">
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
							onClick={saveAndExit}
						>
							Save and Exit
						</button>
					</li>
				</ul>
			</div>
		</>
	);
};
export default EditProfile;
