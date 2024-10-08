import DOMPurify from "dompurify";
import React, { useState } from "react";

export const EditProfile = () => {
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
    buttonContainer: "flex space-x-4 mt-4",
  };

  const [inputUsernameValue, setInputUsernameValue] = useState("");
  const [inputEmailValue, setInputEmailValue] = useState("");
  const [status, setStatus] = useState("");

  const handleInputUsernameChange = (event: any) => {
    setInputUsernameValue(DOMPurify.sanitize(event.target.value));
  };

  const handleInputEmailChange = (event: any) => {
    setInputEmailValue(DOMPurify.sanitize(event.target.value));
  };

  const patchNewUsername = async () => {
    const newUsername = inputUsernameValue;
    const url = `api/users/update-username`;

    const requestBody = {
      newUsername: newUsername,
    };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const patchNewEmail = async () => {
    const newEmail = inputEmailValue;
    const url = `/api/users/update-email`;

    const requestBody = {
      newEmail: newEmail,
    };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  const handlePasswordReset = async () => {

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response.ok) {
        setStatus("Password reset link sent to your email.");
      } else {
        setStatus("Error sending reset link.");
      }
    } catch (error) {
      setStatus("Error sending reset link.");
    }
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
    
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-bkg">
        <h2 className="text-xl font-bold">Profile</h2>
        <p className="text-sm text-content2">
          This is how others will see you on the site.
        </p>
        <hr className="mr-8"></hr>
        <div className="flex flex-col items-center mr-4">
          <ul className="w-full">
            <li className="flex flex-col py-2 mr-4">
              <label htmlFor="username" className="text-content font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Change your username"
                value={inputUsernameValue}
                onChange={handleInputUsernameChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out text-gray-700 placeholder-gray-400"
              />
            </li>
            <p className="text-sm mb-4 text-content2">
              This is your public display name that other users will identify
              you with.
            </p>

            <li className="flex flex-col py-2 mr-4">
            <label
              htmlFor="email"
              className="block text-content font-bold mb-2"
            >
                Change Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Change your email"
                value={inputEmailValue}
                onChange={handleInputEmailChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out text-gray-700 placeholder-gray-400"
              />
            </li>
            <p className="text-sm mb-4 text-content2">
              This is your email address you use to log in.
            </p>

            <li className="flex flex-col py-2 mr-4">
              <div className={modalStyles.buttonContainer}>
                <button
                  className="bg-navBkg hover:bg-gray-400 text-txtBtn font-bold py-2 px-4 rounded transition ease-in-out"
                  onClick={saveAndExit}
                >
                  Update Profile
                </button>
                <button
                  className="bg-navBkg hover:bg-gray-400 text-txtBtn font-bold py-2 px-4 rounded transition ease-in-out"
                  onClick={handlePasswordReset}
                >
                  Reset Your Password
                </button>
              </div>
              {status && <p className="text-sm text-red-500">{status}</p>}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
