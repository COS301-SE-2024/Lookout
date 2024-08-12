import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import AWS from "aws-sdk";

const generateRandomString = (length: number) => {
	const array = new Uint8Array(length / 2);
	window.crypto.getRandomValues(array);
	return Array.from(array, (byte) =>
		("0" + byte.toString(16)).slice(-2)
	).join("");
};
const randomBytes = generateRandomString(16);
const region = "eu-west-1";
const bucketName = "lookout-bucket-capstone";
const accessKeyId = process.env.REACT_APP_AWS_S3_ACCESS_ID;
const secretAccessKey = process.env.REACT_APP_AWS_S3_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
	region,
	accessKeyId,
	secretAccessKey,
	signatureVersion: "v4"
});

interface S3UploaderProps {
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export const S3Uploader: React.FC<S3UploaderProps> = ({ setOpen }) => {
	const [imageFile, setImageFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);

	useEffect(() => {
		if (previewUrl) {
			localStorage.setItem("previewUrl", previewUrl);
		}
	}, [previewUrl]);

	if (process.env.REACT_APP_ENV !== "DEV") {
		const generateUploadURL = async () => {
			const rawBytes = await randomBytes;
			const imageName = rawBytes.toString();

			const params = {
				Bucket: bucketName,
				Key: imageName,
				Expires: 60
			};

			const uploadURL = await s3.getSignedUrlPromise("putObject", params);
			return uploadURL;
		};

		const handleFileChange = (event: any) => {
			const file = event.target.files[0];
			setImageFile(file);

			const reader: any = new FileReader();
			reader.onloadend = () => {
				setPreviewUrl(reader.result);
			};
			if (file) {
				reader.readAsDataURL(file); // Read the file to generate a data URL
			}
		};

		const storeProfilePic = async (imageUrl: string) =>
			await fetch("/api/users/update-profile-pic", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					userId: 1,
					newProfilePicUrl: imageUrl
				})
			});

		const handleSubmit = async (event: any) => {
			event.preventDefault();
			if (!imageFile) {
				alert("Please select an image file to upload.");
				return;
			}

			const url = await generateUploadURL();

			await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "multipart/form-data"
				},
				body: imageFile
			})
				.then(() => {
					storeProfilePic(url.split("?")[0]);
				})
				.catch((error: any) => {
					console.error("Error uploading file:", error);
				});

			setOpen(false);

			// const img = document.createElement("img");
			// img.src = imageUrl;
			// document.body.appendChild(img);
		};
		return (
			<form
				onSubmit={handleSubmit}
				className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
			>
				<input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					className="block w-full text-sm text-gray-500
						   file:mr-4 file:py-2 file:px-4
						   file:rounded-full file:border-0
						   file:text-sm file:font-semibold
						   file:bg-blue-50 file:text-blue-700
						   hover:file:bg-blue-100
						   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-4"
				/>
				{previewUrl && (
					<div className="mt-4">
						<img
							src={previewUrl}
							alt="Selected preview"
							className="w-full h-auto rounded-lg shadow-md"
						/>
					</div>
				)}
				<button
					type="submit"
					className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					Upload Image
				</button>
			</form>
		);
	}
	return <h1>ONLY WORKS ON PROD</h1>;
};

export default S3Uploader;
