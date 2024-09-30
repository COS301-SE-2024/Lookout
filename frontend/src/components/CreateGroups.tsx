import React, { useState } from "react";
import AWS from "aws-sdk";
import { FaPlus, FaTimes, FaTrash } from "react-icons/fa";

interface CreateGroupsProps {
	onCreateGroup: (newGroup: Group) => void;
	onClose: () => void; // New prop for closing the modal
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

const CreateGroups: React.FC<CreateGroupsProps> = ({
	onCreateGroup,
	onClose
}) => {
	const [isToggled, setIsToggled] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [picture, setPicture] = useState("");
	const [isUploadingPicture, setIsUploadingPicture] = useState(false);

	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	// AWS S3 Configuration
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

	const generateRandomString = (length: number): string => {
		const array = new Uint8Array(length / 2);
		window.crypto.getRandomValues(array);
		return Array.from(array, (byte) =>
			("0" + byte.toString(16)).slice(-2)
		).join("");
	};

	const generateUploadURL = async (): Promise<string> => {
		const randomBytes = generateRandomString(16);
		const imageName = randomBytes;

		const params = {
			Bucket: bucketName,
			Key: imageName,
			Expires: 60
		};

		const uploadURL = await s3.getSignedUrlPromise("putObject", params);
		return uploadURL;
	};

	const uploadImageFileToS3 = async (file: File): Promise<string> => {
		if (!file) {
			throw new Error("No file provided for upload.");
		}

		try {
			const uploadURL = await generateUploadURL();

			await fetch(uploadURL, {
				method: "PUT",
				headers: {
					"Content-Type": file.type
				},
				body: file
			});

			const imageUrl = uploadURL.split("?")[0];


			return imageUrl;
		} catch (error) {
			console.error("Error uploading file:", error);
			throw error;
		}
	};

	const handleCreateClick = async () => {
		const newGroup = {
			name: title,
			description: description,
			picture:
				picture ||
				"https://animalmicrochips.co.uk/images/default_no_animal.jpg",
			isPrivate: isToggled
		};

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
			onCreateGroup(createdGroup);
			setTitle("");
			setDescription("");
			setPicture("");
			setIsToggled(false);
			onClose(); // Close the modal after creating the group
		} catch (error) {
			console.error("Error creating group:", error);
		}
	};

	const handleAddPhotoClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			setIsUploadingPicture(true);
			try {
				const imageUrl = await uploadImageFileToS3(file);
				setPicture(imageUrl);
			} catch (error) {
				console.error("Error uploading picture:", error);
			} finally {
				setIsUploadingPicture(false);
			}
		}
	};

	const handleRemovePhoto = () => {
		setPicture("");
	};

	return (
		<div className="relative p-4 rounded-lg w-full max-w-md bg-nav">
			{/* Close Button */}
			<div className="flex justify-between bg-nav items-center mb-4">
				<h2 className="text-2xl text-content font-bold">Create a New Group</h2>
				<button
					className="text-navBkg2 hover:text-icon"
					onClick={onClose}
				>
					<FaTimes className="text-xl" />
				</button>
			</div>

			<div className="flex justify-center mb-3">
				<button
					className="flex items-center text-gray-500 justify-center w-32 h-32 rounded-lg relative overflow-hidden bg-white border border-gray-500 hover:text-navBkg "
					onClick={handleAddPhotoClick}
					data-testid="add-photo-button"
				>
					{picture ? (
						<>
							<img
								src={picture}
								alt="Selected"
								className="object-cover w-full h-full"
							/>
							{isUploadingPicture && (
								<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
									{/* Spinner SVG */}
									<svg
										className="animate-spin h-8 w-8 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8v8H4z"
										></path>
									</svg>
								</div>
							)}
							<button
								className="absolute top-2 right-2 bg-navBkg text-white p-1 rounded-full text-navBkg"
								onClick={handleRemovePhoto}
								data-testid="remove-photo-button"
							>
								<FaTrash />
							</button>
						</>
					) : (
						<FaPlus className="text-3xl" />
					)}
				</button>
			</div>

			<div className="text-center mb-3 text-content">
				<span className="text-lg">Add a photo</span>
				<input
					type="file"
					accept="image/*"
					style={{ display: "none" }}
					ref={fileInputRef}
					data-testid="file-input"
					onChange={handleFileChange}
				/>
			</div>

			<form>
				<div className="mb-3">
					<label
						htmlFor="formTitle"
						className="block text-sm font-medium text-content"
					>
						Title:
					</label>
					<input
						type="text"
						id="formTitle"
						className="mt-1 block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-grey-500"
						placeholder="Enter title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				<div className="mb-3">
					<label
						htmlFor="formDescription"
						className="block text-sm font-medium text-content"
					>
						Description:
					</label>
					<textarea
						id="formDescription"
						rows={4}
						className="mt-1 block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-grey-500"
						placeholder="Enter description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					></textarea>
				</div>
			</form>

			<div>
				<button
					className="w-full px-4 py-2  bg-navBkg2 text-nav rounded-md hover:bg-nav hover:text-content hover:border hover:border-content "
					onClick={handleCreateClick}
				>
					Create
				</button>
			</div>
		</div>
	);
};

export default CreateGroups;
