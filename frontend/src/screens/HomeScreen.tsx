import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import {
	HeatmapLayer,
	Control,
	GoogleMap,
	GoogleMapApiLoader,
	MarkerClusterer,
	Marker
} from "react-google-map-wrapper";
import "../assets/styles/home.css";
import HomePins from "../components/HomePins";
import { FaFolder, FaCamera, FaTimes, FaPlus } from "react-icons/fa";
import Legend from "../components/Legend";
import CameraComponent from "../components/CameraComponent"; // Ensure this path is correct
import campIcon from "../assets/icons/camping-zone.png";
import AnimalIcon from "../assets/icons/zoo.png";
import HikingIcon from "../assets/icons/mountain.png";
import POIIcon from "../assets/icons/point-of-interest.png";
import SecurityIcon from "../assets/icons/danger.png";
// import { url } from "inspector";
import AWS from "aws-sdk";

// ##############################  HEAT MAP STUFF!!
const getData = () => [
	new google.maps.LatLng(-27.782551, 22.445368),
	new google.maps.LatLng(-27.782745, 22.444586),
	new google.maps.LatLng(-27.752986, 22.403112),
	new google.maps.LatLng(-27.751266, 22.403355)
];

const customGradient = [
	"rgba(0, 255, 255, 0)",
	"rgba(0, 255, 255, 1)",
	"rgba(191, 0, 31, 1)",
	"rgba(255, 0, 0, 1)"
];

function MapContent() {
	const [show, setShow] = useState(true);
	const [gradient, setGradient] = useState<string[] | null>(null);
	const [radius, setRadius] = useState<number | null>(null);
	const [opacity, setOpacity] = useState<number | null>(null);

	const data = useMemo(getData, []);

	const toggleHeatmap = () => {
		setShow(!show);
	};

	const changeGradient = () => {
		setGradient((prev) => (prev ? null : customGradient));
	};

	const changeRadius = () => {
		setRadius(radius ? null : 20);
	};

	const changeOpacity = () => {
		setOpacity(opacity ? null : 0.2);
	};

	return (
		<>
			<HeatmapLayer
				data={data}
				gradient={gradient}
				radius={radius}
				opacity={opacity}
				hidden={!show}
			/>
			<Control position={google.maps.ControlPosition.TOP_CENTER}>
				<div
					id="floating-panel"
					className="flex space-x-2 p-3 bg-white bg-opacity-80 rounded-lg shadow-lg"
				>
					<button
						id="toggle-heatmap"
						onClick={toggleHeatmap}
						className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
					>
						Toggle Heatmap
					</button>
					<button
						id="change-gradient"
						onClick={changeGradient}
						className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
					>
						Change Gradient
					</button>
					<button
						id="change-radius"
						onClick={changeRadius}
						className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
					>
						Change Radius
					</button>
					<button
						id="change-opacity"
						onClick={changeOpacity}
						className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
					>
						Change Opacity
					</button>
				</div>
			</Control>
		</>
	);
}

// #################### END OF HEAT MAP STUFF

type Poi = {
	key: string;
	location: google.maps.LatLngLiteral;
	label: string;
	details: string;
};
type myPin = {
	id: string;
	location: google.maps.LatLngLiteral;
	caption: string;
	category: string;
	image: string;
	categoryId: number;
};

const legendItems = [
	{
		name: "Nature Reserves",
		icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
	},
	{ name: "Camp Sites", icon: campIcon },
	{ name: "Animal", icon: AnimalIcon },
	{ name: "Hiking", icon: HikingIcon },
	{ name: "POI", icon: POIIcon },
	{ name: "Security Risk", icon: SecurityIcon }
];

const locations: Poi[] = [
	{
		key: "krugerNationalPark",
		location: { lat: -23.9884, lng: 31.5547 },
		label: "Kruger National Park",
		details:
			"One of Africa's largest game reserves, home to the Big Five: lions, leopards, rhinos, elephants, and buffalos."
	},
	{
		key: "addoElephantPark",
		location: { lat: -33.4468, lng: 25.7484 },
		label: "Addo Elephant Park",
		details:
			"Famous for its large population of elephants, as well as lions, hyenas, and various antelope species."
	},
	{
		key: "tableMountainNationalPark",
		location: { lat: -34.0104, lng: 18.3736 },
		label: "Table Mountain National Park",
		details:
			"Known for its rich biodiversity, including the unique fynbos vegetation and various bird species."
	},
	{
		key: "iSimangalisoWetlandPark",
		location: { lat: -28.382, lng: 32.4143 },
		label: "iSimangaliso Wetland Park",
		details:
			"A UNESCO World Heritage Site with diverse ecosystems, including estuaries, lakes, and wetlands, home to hippos, crocodiles, and numerous bird species."
	},
	{
		key: "kgalagadiTransfrontierPark",
		location: { lat: -26.2825, lng: 20.615 },
		label: "Kgalagadi Transfrontier Park",
		details:
			"Known for its large predators, including lions, cheetahs, and leopards, as well as herds of wildebeest and springbok."
	},
	{
		key: "karooNationalPark",
		location: { lat: -32.2968, lng: 22.5287 },
		label: "Karoo National Park",
		details:
			"Home to a variety of desert-adapted wildlife, including gemsbok, mountain zebra, and a rich diversity of plant life."
	},
	{
		key: "hluhluweImfoloziPark",
		location: { lat: -28.0493, lng: 31.9189 },
		label: "Hluhluwe-Imfolozi Park",
		details:
			"The oldest proclaimed nature reserve in Africa, famous for its conservation of the white rhinoceros and also home to the Big Five."
	},
	{
		key: "madikweGameReserve",
		location: { lat: -24.7486, lng: 26.2418 },
		label: "Madikwe Game Reserve",
		details:
			"A malaria-free game reserve that offers sightings of the Big Five, wild dogs, and a variety of bird species."
	},
	{
		key: "goldenGateHighlandsNationalPark",
		location: { lat: -28.5145, lng: 28.608 },
		label: "Golden Gate Highlands National Park",
		details:
			"Famed for its stunning sandstone formations and diverse wildlife, including elands, zebras, and vultures."
	},
	{
		key: "bouldersBeachPenguinColony",
		location: { lat: -34.1975, lng: 18.451 },
		label: "Boulders Beach Penguin Colony",
		details:
			"A protected area known for its colony of African penguins, as well as scenic coastal views."
	}
];

type Group = {
	id: number;
	name: string;
	categories: { id: number; name: string }[];
};

const apicode = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const HomeScreen: React.FC = () => {
	const defaultCenter = { lat: -28, lng: 23 };
	const [center, setCenter] = useState(defaultCenter);

	//const id = 2;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
	const [isPhotoOptionsModalOpen, setIsPhotoOptionsModalOpen] =
		useState(false);
	const [isCameraModalOpen, setIsCameraModalOpen] = useState(false); // New state for camera modal
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
	const [groups, setGroups] = useState<Group[]>([]);
	const [caption, setCaption] = useState("");
	const [picture, setPicture] = useState("");
	const [title, setTitle] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<number | null>(
		null
	);
	const [selectCategory, setSelectCategory] = useState(null);
	const [filteredPins, setFilteredPins] = useState<myPin[]>([]);

	const [categoryExpanded, setCategoryExpanded] = useState(false);
	const [groupExpanded, setGroupExpanded] = useState(false);
	const [imageExpanded, setImageExpanded] = useState(false);
	const [titleExpanded, setTitleExpanded] = useState(false);
	const [captionExpanded, setCaptionExpanded] = useState(false);
	const [dragpinExpanded, setDragPinExpanded] = useState(false);
	const [showRecommendedTitle, setShowRecommendedTitle] = useState(false);
	const [predictResult, setPredictResult] = useState("");

	const [currentNumberPins, setCurrentNumberPins] = useState<number>(0);
	const [newNumberPins, setNewNumberPins] = useState<number>(0);

	const [dragpinlatitude, setdragpinLatitude] = useState(latitude);
	const [dragpinlongitude, setdragpinLongitude] = useState(longitude);

	const navigate = useNavigate();

	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	// get curretn for map

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setCenter({
						lat: position.coords.latitude,
						lng: position.coords.longitude
					});
				},
				(error) => {
					console.error("Error getting user's location:", error);
					// If user denies location access or an error occurs, retain the default center
				}
			);
		}
	}, []);

	// get for posts
	const getLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLatitude(position.coords.latitude);
					setLongitude(position.coords.longitude);
					console.log(
						"fetching location long:",
						position.coords.longitude
					);
					console.log(
						"fetching location lat:",
						position.coords.latitude
					);
				},
				(error) => {
					console.error("Error fetching location:", error);
				}
			);
		} else {
			throw new Error("Geolocation is not supported by this browser.");
		}
	};

	const [pins, setPins] = useState<myPin[]>([]);
	const fetchPins = async () => {
		try {
			const response = await fetch("/api/posts", {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			});

			if (!response.ok) {
				throw new Error("Failed to fetch pins");
			}

			const pinsData = await response.json();

			const formattedPins = pinsData.content.map((pin: any) => ({
				id: pin.id,
				location: { lat: pin.latitude, lng: pin.longitude },
				caption: pin.caption,
				category: pin.title,
				categoryId: pin.categoryId,
				image: pin.picture
			}));

			setPins(formattedPins);
			setFilteredPins(formattedPins);
			setCurrentNumberPins(formattedPins.length);
		} catch (error) {
			console.error("Error fetching pins:", error);
		}
	};
	useEffect(() => {
		fetchPins();
	}, []);

	useEffect(() => {
		if (newNumberPins > currentNumberPins) {
			setCurrentNumberPins(newNumberPins);
			fetchPins();
		}
	}, [newNumberPins, currentNumberPins]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			fetchPins();
		}, 15000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		if (selectCategory === null) {
			setFilteredPins(pins);
		} else {
			const categoryId =
				typeof selectCategory === "number"
					? selectCategory
					: Number(selectCategory);

			setFilteredPins(
				pins.filter((pin) => pin.categoryId === categoryId)
			);
		}
	}, [selectCategory, pins]);

	const handleCategoryClick = (categoryId: any) => {
		setSelectCategory(categoryId);
	};

	// Function to convert blob URL to base64
	// async function blobToBase64(blobUrl: string) {
	// 	const response = await fetch(blobUrl);
	// 	const blob = await response.blob();
	// 	return new Promise((resolve, reject) => {
	// 		const reader = new FileReader();
	// 		reader.onloadend = () => {
	// 			if (typeof reader.result === "string") {
	// 				resolve(reader.result.split(",")[1]); // Get the base64 string
	// 			}
	// 		};
	// 		reader.onerror = reject;
	// 		reader.readAsDataURL(blob);
	// 	});
	// }

	const handleAddPinClick = async () => {
		if (selectedGroup === null) {
			alert("Please select a group.");
			return;
		}
		if (selectedCategory === null) {
			alert("Please select a category.");
			return;
		}

		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		// let Image;

		// if (picture.startsWith("blob:")) {
		// 	Image = await blobToBase64(picture);
		// } else {
		// 	Image = picture.split(",")[1];
		// }

		const raw = JSON.stringify({
			// caption: caption,
			// title: title,
			// categoryId: selectedCategory,
			// userId: 112,
			// groupId: selectedGroup,
			// image: "https://h5p.org/sites/default/files/h5p/content/1209180/images/file-6113d5f8845dc.jpeg",
			// latitude: latitude,
			// longitude: longitude
			caption: caption,
			title: title,
			categoryid: selectedCategory,
			userid: 112,
			groupid: selectedGroup,
			picture: picture,
			latitude:
				dragpinlatitude !== null &&
				dragpinlatitude !== undefined &&
				dragpinlatitude !== 0
					? dragpinlatitude
					: latitude,
			longitude:
				dragpinlongitude !== null &&
				dragpinlongitude !== undefined &&
				dragpinlongitude !== 0
					? dragpinlongitude
					: longitude
		});

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: raw
		};

		try {
			//old way
			// const response = await fetch("/api/image/create", requestOptions);
			console.log("raw", raw);
			const response = await fetch(
				"/api/posts/CreatePost",
				requestOptions
			);

			if (!response.ok) {
				throw new Error("Error");
			}
			console.log("title", title);
			setCaption("");
			setTitle("");
			setPicture("");
			setSelectedGroup(null);
			setSelectedCategory(null);
			closeModal();

			setIsSuccessModalOpen(true); // Open success modal
			setNewNumberPins(newNumberPins + 1);
			// setIsModalOpen(false); // Close modal after successful pin addition
			// setIsSuccessModalOpen(true); // Open success modal
		} catch (error) {
			console.error("Error creating post:", error);
		}
	};

	const handleAddPhotoClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
		setIsPhotoOptionsModalOpen(false);
	};

	const handleTakePhotoClick = () => {
		setIsCameraModalOpen(true);
		setIsPhotoOptionsModalOpen(false);
	};

	const openPhotoModal = () => {
		setIsPhotoOptionsModalOpen(true);
	};

	//###########################################################################
	//S3 ZONE
	//#############################################################################
	// Helper function to generate a random string for unique file names
	const generateRandomString = (length: number): string => {
		const array = new Uint8Array(length / 2);
		window.crypto.getRandomValues(array);
		return Array.from(array, (byte) =>
			("0" + byte.toString(16)).slice(-2)
		).join("");
	};

	// Configuration
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

	const generateUploadURL = async (): Promise<string> => {
		const randomBytes = generateRandomString(16);
		const imageName = randomBytes.toString();

		const params = {
			Bucket: bucketName,
			Key: imageName,
			Expires: 60
		};

		const uploadURL = await s3.getSignedUrlPromise("putObject", params);
		return uploadURL;
	};

	const uploadImageFileToS3 = async (file: File): Promise<void> => {
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

			setPicture(uploadURL.split("?")[0]);
			if (showRecommendedTitle) {
				const formdata = new FormData();

				// Append file to FormData, ensuring the file is present
				formdata.append("image", file);

				const requestOptions = {
					method: "POST",
					body: formdata
				};

				try {
					const response = await fetch(
						"http://localhost:5000/predict",
						requestOptions
					);
					const result = await response.json();

					setPredictResult(result.predicted_class);
					setTitle(result.predicted_class);
					console.log(result);
				} catch (error) {
					console.error("Error during prediction:", error);
				}
			}
			console.log(
				"Image uploaded and profile picture updated successfully.",
				uploadURL.split("?")[0]
			);
		} catch (error) {
			console.error("Error uploading file:", error);
		}
	};

	const base64ToBuffer = (base64: string): Uint8Array => {
		const binaryString = window.atob(base64);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes;
	};

	const generateUploadURL64 = async (imageName: string): Promise<string> => {
		const params = {
			Bucket: bucketName,
			Key: imageName,
			Expires: 60
		};

		const uploadURL = await s3.getSignedUrlPromise("putObject", params);
		return uploadURL;
	};

	const uploadBase64ImageToS3 = async (
		base64Image: string
	): Promise<void> => {
		if (!base64Image) {
			throw new Error("No image data provided for upload.");
		}

		try {
			const base64Data = base64Image.split(",")[1];
			if (!base64Data) throw new Error("Invalid base64 image data.");
			const binaryData = base64ToBuffer(base64Data);
			const imageName = generateRandomString(16) + ".png";
			const uploadURL = await generateUploadURL64(imageName);
			await fetch(uploadURL, {
				method: "PUT",
				headers: {
					"Content-Type": "image/png"
				},
				body: binaryData
			});
			await setPicture(uploadURL.split("?")[0]);

			if (showRecommendedTitle) {
				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				const raw = JSON.stringify({
					image_url: uploadURL.split("?")[0]
				});

				const requestOptions = {
					method: "POST",
					headers: myHeaders,
					body: raw
				};

				try {
					const response = await fetch(
						"http://localhost:5000/predict",
						requestOptions
					);
					const result = await response.json();
					setPredictResult(result.predicted_class);
					setTitle(result.predicted_class);
					console.log(result);
				} catch (error) {
					console.error(error);
				}
			}
			console.log(uploadURL.split("?")[0]);
			console.log(picture);
			console.log(
				"Image uploaded and profile picture updated successfully."
			);
		} catch (error) {
			console.error("Error uploading image:", error);
		}
	};

	//#######################################################

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			uploadImageFileToS3(file);
		}
	};

	const openModal = () => {
		getLocation();
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const openMenuModal = () => {
		setIsMenuModalOpen(true);
	};

	const closeMenuModal = () => {
		setIsMenuModalOpen(false);
	};

	useEffect(() => {
		fetch(`/api/groups/user/1`, {
			method: "GET",
			headers: {
				Accept: "application/json"
			}
		})
			.then((response) => response.json())
			.then((data) => {
				// console.log(data); // Log the data to check the response format
				setGroups(data);
			})
			.catch((error) => console.error("Error fetching groups:", error));
	}, []);

	const categories = [
		{ id: 1, name: "Animal Sighting" },
		{ id: 2, name: "Campsite" },
		{ id: 3, name: "Hiking Trail" },
		{ id: 4, name: "POI" },
		{ id: 5, name: "Security Concern" }
	];

	return (
		<GoogleMapApiLoader apiKey={apicode || ""} suspense>
			<div className="map-container">
				<GoogleMap
					className="h-full w-full"
					zoom={5}
					center={center}
					mapOptions={{
						disableDefaultUI: true,
						zoomControl: true,
						mapId: "dde51c47799889c4"
					}}
				>
					<PoiMarkers pois={locations} />
					<HomePins pin={filteredPins} />
					<MapContent />
				</GoogleMap>
				<Legend items={legendItems} />
			</div>
			<div className="fixed top-12 left-4 z-10" id="menu">
				<IoMenu size={32} onClick={openMenuModal} />
			</div>
			<button
				className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white py-2 px-4 rounded-full hover:bg-gray-800 sm:bottom-24 md:bottom-20"
				onClick={openModal}
			>
				+
			</button>

			{/* Add pin modal */}
			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="relative bg-white p-6 rounded-lg w-full max-w-md mx-auto">
						<button
							className="absolute top-2 right-2 text-xl"
							onClick={closeModal}
						>
							&times;
						</button>
						<h2 className="text-2xl font-bold mb-4">Add a Pin</h2>

						<form>
							{/* Collapsible Category Section */}
							<div className="mb-3 border-2 border-black rounded-md p-3">
								<label
									htmlFor="categorySelect"
									className="block text-sm font-medium text-gray-700 cursor-pointer"
									onClick={() =>
										setCategoryExpanded(!categoryExpanded)
									}
								>
									Select Category:
								</label>
								{categoryExpanded && (
									<select
										id="categorySelect"
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
										value={selectedCategory ?? ""}
										onChange={(e) =>
											setSelectedCategory(
												Number(e.target.value)
											)
										}
									>
										<option value="" disabled>
											Select a category
										</option>
										{categories.map((category) => (
											<option
												key={category.id}
												value={category.id}
											>
												{category.name}
											</option>
										))}
									</select>
								)}
							</div>

							{/* Collapsible Group Section */}
							<div className="mb-3 border-2 border-black rounded-md p-3">
								<label
									htmlFor="groupSelect"
									className="block text-sm font-medium text-gray-700 cursor-pointer"
									onClick={() =>
										setGroupExpanded(!groupExpanded)
									}
								>
									Select Group:
								</label>
								{groupExpanded && (
									<select
										id="groupSelect"
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
										value={selectedGroup ?? ""}
										onChange={(e) =>
											setSelectedGroup(
												Number(e.target.value)
											)
										}
									>
										<option value="" disabled>
											Select a group
										</option>
										{groups.map((group) => (
											<option
												key={group.id}
												value={group.id}
											>
												{group.name}
											</option>
										))}
									</select>
								)}
							</div>

							{/* Collapsible Image Section */}
							<div className="mb-3 border-2 border-black rounded-md p-3">
								<label
									className="block text-sm font-medium text-gray-700 cursor-pointer"
									onClick={() =>
										setImageExpanded(!imageExpanded)
									}
								>
									Add Image:
								</label>
								{imageExpanded && (
									<div className="flex justify-center mb-3">
										{!picture && (
											<button
												type="button"
												className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg"
												onClick={openPhotoModal}
											>
												<FaPlus />
											</button>
										)}
										<input
											type="file"
											accept="image/jpeg, image/png"
											style={{ display: "none" }}
											ref={fileInputRef}
											onChange={handleFileChange}
										/>
										{picture && (
											<img
												src={picture}
												alt="Selected"
												className="w-32 h-32 mt-2 mx-auto"
											/>
										)}
									</div>
								)}
							</div>

							{/* Title Section with Slider */}
							<div className="mb-3 border-2 border-black rounded-md p-3">
								<div className="flex items-center justify-between">
									<label
										htmlFor="formTitle"
										className="block text-sm font-medium text-gray-700 cursor-pointer"
										onClick={() =>
											setTitleExpanded(!titleExpanded)
										}
									>
										Title:
									</label>

									{/* Slider for Recommended Title */}
									{selectedCategory === 1 && (
										<div className="flex items-center">
											<span className="text-sm mr-2">
												Recommended
											</span>
											<label className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
												<input
													type="checkbox"
													className="toggle-checkbox"
													checked={
														showRecommendedTitle
													}
													onChange={async () => {
														// Toggle the checkbox state
														const newShowRecommendedTitle =
															!showRecommendedTitle;
														setShowRecommendedTitle(
															newShowRecommendedTitle
														);

														if (
															newShowRecommendedTitle &&
															!predictResult &&
															fileInputRef.current
																?.files &&
															fileInputRef.current
																.files[0]
														) {
															const formdata =
																new FormData();
															const file =
																fileInputRef
																	.current
																	.files[0];
															formdata.append(
																"image",
																file
															);

															const requestOptions =
																{
																	method: "POST",
																	body: formdata
																};

															try {
																const response =
																	await fetch(
																		"http://localhost:5000/predict",
																		requestOptions
																	);
																const result =
																	await response.json();

																setPredictResult(
																	result.predicted_class
																);

																setTitle(
																	result.predicted_class
																);

																console.log(
																	result
																);
															} catch (error) {
																console.error(
																	"Error during prediction:",
																	error
																);
															}
														} else if (
															newShowRecommendedTitle &&
															!predictResult
														) {
															const myHeaders =
																new Headers();
															myHeaders.append(
																"Content-Type",
																"application/json"
															);

															const raw =
																JSON.stringify({
																	image_url:
																		picture
																});

															const requestOptions =
																{
																	method: "POST",
																	headers:
																		myHeaders,
																	body: raw
																};

															try {
																const response =
																	await fetch(
																		"http://localhost:5000/predict",
																		requestOptions
																	);
																const result =
																	await response.json();
																setPredictResult(
																	result.predicted_class
																);
																setTitle(
																	result.predicted_class
																);
																console.log(
																	result
																);
															} catch (error) {
																console.error(
																	error
																);
															}
														} else if (
															!newShowRecommendedTitle
														) {
															// If the checkbox is unchecked, clear the title
															setTitle("");
														} else if (
															newShowRecommendedTitle
														) {
															setTitle(
																predictResult
															);
														}
													}}
												/>
												<span className="toggle-label"></span>
											</label>
										</div>
									)}
								</div>

								{/* Expandable Text Area for Title */}
								{titleExpanded && (
									<div className="mt-2">
										<textarea
											id="formTitle"
											rows={2}
											className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder="Enter title"
											value={title}
											onChange={(e) =>
												setTitle(e.target.value)
											}
										></textarea>
									</div>
								)}
							</div>

							{/* Collapsible Caption Section */}
							<div className="mb-3 border-2 border-black rounded-md p-3">
								<label
									htmlFor="formCaption"
									className="block text-sm font-medium text-gray-700 cursor-pointer"
									onClick={() =>
										setCaptionExpanded(!captionExpanded)
									}
								>
									Caption:
								</label>
								{captionExpanded && (
									<textarea
										id="formCaption"
										rows={4}
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
										placeholder="Enter description"
										value={caption}
										onChange={(e) =>
											setCaption(e.target.value)
										}
									></textarea>
								)}
							</div>

							<div className="mb-3 border-2 border-black rounded-md p-3">
								<label
									htmlFor="formDescription"
									className="block text-sm font-medium text-gray-700 cursor-pointer"
									onClick={() =>
										setDragPinExpanded(!dragpinExpanded)
									}
								>
									Sighting Location:
								</label>
								{dragpinExpanded && (
									<div id="sightlocation">
										<GoogleMapApiLoader
											apiKey={apicode || ""}
											suspense
										>
											<GoogleMap
												className="h-full w-full"
												zoom={15}
												center={center}
												mapOptions={{
													disableDefaultUI: true,
													zoomControl: true,
													mapId: "dde51c47799889c4"
												}}
											>
												{" "}
												{/* draggable */}
												<Marker
													lat={latitude}
													lng={longitude}
													title={"Sighting Location"}
													draggable
													onDragEnd={(event) => {
														const newPosition =
															event.getPosition();
														const newLat =
															newPosition?.lat();
														const newLng =
															newPosition?.lng();

														setdragpinLatitude(
															newLat !== null &&
																newLat !==
																	undefined
																? newLat
																: latitude
														);
														setdragpinLongitude(
															newLng !== null &&
																newLng !==
																	undefined
																? newLng
																: longitude
														);

														console.log(
															`Marker dropped at: Latitude ${newLat}, Longitude ${newLng}`
														);
													}}
												/>
											</GoogleMap>
										</GoogleMapApiLoader>
									</div>
								)}
							</div>

							{/* Submit button only enabled when all fields are filled */}
							<div>
								<button
									className={`w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
										!selectedCategory ||
										!selectedGroup ||
										!picture ||
										!title ||
										!caption
											? "opacity-50 cursor-not-allowed"
											: ""
									}`}
									onClick={handleAddPinClick}
									disabled={
										!selectedCategory ||
										!selectedGroup ||
										!picture ||
										!title ||
										!caption
									}
								>
									Add Pin
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Success modal */}
			{isSuccessModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-6 rounded-lg w-full max-w-md mx-auto">
						<h2 className="text-2xl font-bold mb-4 text-center">
							Post Created Successfully!
						</h2>
						<button
							className="block mx-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
							onClick={() => {
								setIsSuccessModalOpen(false);

								navigate("/");
							}}
						>
							Okay
						</button>
					</div>
				</div>
			)}

			{/* PhotoOptions modal */}
			{isPhotoOptionsModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-6 rounded-lg w-full max-w-md mx-auto relative">
						<h2 className="text-2xl font-bold mb-4 text-center">
							Photo
						</h2>
						<div className="flex justify-between mb-4">
							<button
								className="absolute top-4 right-4 px-2 py-1  focus:outline-none focus:ring-2 "
								onClick={() =>
									setIsPhotoOptionsModalOpen(false)
								}
							>
								<FaTimes />
							</button>
							<button
								className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center space-x-2"
								onClick={handleAddPhotoClick}
							>
								<FaFolder size={20} />
								<span className="text-base">
									Upload A Photo
								</span>
							</button>

							<button
								className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center space-x-2"
								onClick={handleTakePhotoClick}
							>
								<FaCamera size={20} />
								<span className="text-base">Take A Photo</span>
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Camera modal */}
			{isCameraModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="relative bg-white p-6 rounded-lg w-full max-w-sm mx-auto">
						<button
							className="absolute top-2 right-2 text-xl"
							onClick={() => setIsCameraModalOpen(false)}
						>
							&times;
						</button>
						<h2 className="text-2xl font-bold mb-4">
							Take A Photo
						</h2>
						<CameraComponent
							onCapture={(url) => {
								// shortenURL(url);

								// setPicture(url);
								setPicture(url);
								uploadBase64ImageToS3(url);
								setIsCameraModalOpen(false);
							}}
						/>
					</div>
				</div>
			)}

			{/* Menu modal */}
			{isMenuModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div
						className="relative bg-white p-4 rounded-lg"
						style={{
							width: "80%",
							maxHeight: "80vh",
							overflowY: "auto"
						}}
					>
						<button
							className="absolute top-0 left-0 mt-1 ml-1 p-2"
							onClick={closeMenuModal}
						>
							X
						</button>
						<div className="mt-4">
							<h2 className="text-lg font-semibold">
								Pins Displaying
							</h2>
							<div className="mt-2">
								<button
									className={`w-full text-left p-2 rounded mb-2 ${
										selectCategory === null
											? "bg-gray-400"
											: "bg-gray-200"
									}`}
									onClick={() => handleCategoryClick(null)}
								>
									All Pins
								</button>
								{categories.map((category) => (
									<div key={category.id}>
										<button
											className={`w-full text-left p-2 rounded mb-2 ${
												selectCategory === category.id
													? "bg-gray-400"
													: "bg-gray-200"
											}`}
											onClick={() =>
												handleCategoryClick(category.id)
											}
										>
											{category.name}
										</button>
									</div>
								))}
							</div>
							<div className="flex justify-center mt-4">
								<button
									className="py-2 px-4 bg-gray-500 text-white rounded-full hover:bg-gray-800"
									onClick={closeMenuModal}
								>
									Save
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</GoogleMapApiLoader>
	);
};

const PoiMarkers = (props: { pois: Poi[] }) => {
	return (
		<MarkerClusterer>
			{props.pois.map((poi, i) => (
				<Marker
					key={poi.key}
					lat={poi.location.lat}
					lng={poi.location.lng}
				></Marker>
			))}
		</MarkerClusterer>
	);
};

export default HomeScreen;
