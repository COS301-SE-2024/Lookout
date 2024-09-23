import React, { useState } from "react";
import { FaToggleOn, FaToggleOff, FaPlus } from "react-icons/fa";
import AWS from "aws-sdk"; // Import AWS SDK

interface CreateGroupsProps {
	onCreateGroup: (newGroup: Group) => void;
}

interface Group {
	id: number;
	name: string;
	owner: string;
	picture: string;
	description: string;
	isPrivate: boolean;
	createdAt: string;
}

const CreateGroups: React.FC<CreateGroupsProps> = ({ onCreateGroup }) => {
	const [isToggled, setIsToggled] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [picture, setPicture] = useState("");
	const [uploadedPictureUrl, setUploadedPictureUrl] = useState<string>(""); // State to store uploaded image URL
	const [isUploadingPicture, setIsUploadingPicture] = useState(false); // State to track upload status

	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	const toggleSwitch = () => {
		setIsToggled(!isToggled);
	};

	const region = "eu-west-1";
	const bucketName = "lookout-bucket-capstone";
	const accessKeyId = process.env.REACT_APP_AWS_S3_ACCESS_ID || "";
	const secretAccessKey =
		process.env.REACT_APP_AWS_S3_SECRET_ACCESS_KEY || "";

	// Initialize AWS S3
	const s3 = new AWS.S3({
		region,
		accessKeyId,
		secretAccessKey,
		signatureVersion: "v4"
	});

	// Helper function to generate a random string for unique file names
	const generateRandomString = (length: number): string => {
		const array = new Uint8Array(length / 2);
		window.crypto.getRandomValues(array);
		return Array.from(array, (byte) =>
			("0" + byte.toString(16)).slice(-2)
		).join("");
	};

	// Function to generate a signed URL for uploading
	const generateUploadURL = async (): Promise<string> => {
		const imageName = generateRandomString(16) + ".jpg"; // Generate a unique file name

		const params = {
			Bucket: bucketName,
			Key: imageName,
			Expires: 60 // URL expires in 60 seconds
		};

		const uploadURL = await s3.getSignedUrlPromise("putObject", params);
		return uploadURL;
	};

	// Function to upload image file to S3
	const uploadImageFileToS3 = async (file: File): Promise<void> => {
		if (!file) {
			throw new Error("No file provided for upload.");
		}

		try {
			setIsUploadingPicture(true); // Start uploading

			const uploadURL = await generateUploadURL();

			await fetch(uploadURL, {
				method: "PUT",
				headers: {
					"Content-Type": file.type
				},
				body: file
			});

			const imageUrl = uploadURL.split("?")[0]; // Get the URL without query parameters
			setUploadedPictureUrl(imageUrl);
			setIsUploadingPicture(false); // Upload complete

			console.log("Image uploaded successfully:", imageUrl);
		} catch (error) {
			console.error("Error uploading file:", error);
			setIsUploadingPicture(false);
		}
	};

	const handleCreateClick = async () => {
		if (!title || !description) {
			alert("Please fill in all required fields.");
			return;
		}

		if (isUploadingPicture) {
			alert("Image is still uploading. Please wait.");
			return;
		}

		const newGroup = {
			name: title,
			description: description,
			picture:
				uploadedPictureUrl ||
				"https://animalmicrochips.co.uk/images/default_no_animal.jpg",
			isPrivate: isToggled,
			userId: 2 // Replace with the actual user ID
		};

		console.log("Creating new group:", newGroup);

		try {
			const response = await fetch("/api/groups", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(newGroup)
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const createdGroup = await response.json();

			// Display success alert
			alert("Success");

			onCreateGroup(createdGroup);
			setTitle("");
			setDescription("");
			setPicture("");
			setUploadedPictureUrl("");
			setIsToggled(false);
		} catch (error) {
			console.error("Error creating group:", error);
		}
	};

	const handleAddPhotoClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const localUrl = URL.createObjectURL(file);
			setPicture(localUrl); // Optimistically set the local URL
			uploadImageFileToS3(file); // Start uploading to S3
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-2xl font-bold mb-4">Create Group</h2>

			<div className="flex justify-center mb-3">
				{!picture && (
					<button
						className="flex items-center justify-center w-32 h-32 border border-gray-300 rounded-full hover:bg-gray-100"
						onClick={handleAddPhotoClick}
						data-testid="add-photo-button"
					>
						<FaPlus className="text-3xl text-gray-500" />
					</button>
				)}
				<input
					type="file"
					accept="image/jpeg, image/png"
					style={{ display: "none" }}
					ref={fileInputRef}
					data-testid="file-input"
					onChange={handleFileChange}
				/>
				{picture && (
					<img
						src={picture}
						alt="Selected"
						className="w-32 h-32 object-cover rounded-full border-2 border-gray-300 shadow-lg"
					/>
				)}
			</div>

			<form>
				<div className="mb-3">
					<label
						htmlFor="formTitle"
						className="block text-sm font-medium text-gray-700"
					>
						Title:
					</label>
					<input
						type="text"
						id="formTitle"
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				<div className="mb-3">
					<label
						htmlFor="formDescription"
						className="block text-sm font-medium text-gray-700"
					>
						Description:
					</label>
					<textarea
						id="formDescription"
						rows={4}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					></textarea>
				</div>

				<div className="mb-3">
					<div className="flex justify-between items-center">
						<label
							htmlFor="visibilityToggle"
							className="text-sm font-medium text-gray-700"
						>
							Visibility - set your group to private:
						</label>
						<button
							id="visibilityToggle"
							aria-checked={isToggled}
							role="switch"
							onClick={toggleSwitch}
							className="cursor-pointer"
							data-testid="visibility-toggle"
						>
							{isToggled ? (
								<FaToggleOn className="text-2xl text-green-500" />
							) : (
								<FaToggleOff className="text-2xl text-gray-500" />
							)}
						</button>
					</div>
				</div>
			</form>

			<div>
				<button
					className={`w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
						!title || !description || isUploadingPicture
							? "cursor-not-allowed opacity-50"
							: ""
					}`}
					onClick={handleCreateClick}
					disabled={!title || !description || isUploadingPicture}
				>
					{isUploadingPicture ? "Uploading Image..." : "Create"}
				</button>
			</div>
		</div>
	);
};

export default CreateGroups;
