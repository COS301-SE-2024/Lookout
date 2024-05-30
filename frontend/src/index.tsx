import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/index.css";
import App from "./App";
import reportWebVitals from "./webvitals/reportWebVitals";
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements
} from "react-router-dom";

import HomeScreen from "./screens/HomeScreen";
import ExploreScreen from "./screens/ExploreScreen";
import GroupScreen from "./screens/GroupScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import GroupDetail from './components/GroupDetail';
import PinDetail from './components/PinDetail';

function Main() {
	useEffect(() => {
		const currentTheme = localStorage.getItem("data-theme");
		if (currentTheme) {
			document.documentElement.setAttribute("data-theme", currentTheme);
		} else {
			localStorage.setItem("data-theme", "default");
			document.documentElement.setAttribute("data-theme", "default");
		}
	}, []);

	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={<App />}>
				<Route index={true} path="/" element={<HomeScreen />} />
				<Route path="/explore" element={<ExploreScreen />} />
				<Route path="/groups" element={<GroupScreen />} />
				<Route path="/login" element={<LoginScreen />} />
				<Route path="/signup" element={<SignUpScreen />} />
				<Route path="/group/:id" element={<GroupDetail />} />
				<Route path="/pin/:id" element={<PinDetail />} />
			</Route>
		)
	);

	return (
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>
	);
}

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(<Main />);
