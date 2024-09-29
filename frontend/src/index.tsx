import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/index.css";
import App from "./App";
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements
} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import GroupScreen from "./screens/GroupScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import GroupDetail from "./components/GroupDetail";
import PinDetail from "./components/PinDetail";
import GroupPosts from "./components/GroupPosts";
import Profile from "./screens/Profile";
import ProfileDetail from "./components/ProfileDetail";
import GroupsMap from "./components/GroupsMap";
import ExploreScreen from "./screens/ExploreScreen";
import UserPostDetails from "./components/UserPostDetails";
import SavedPostDetails from "./components/SavedPostDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import CategoryPostsPage from "./screens/CategoryPostsPage";
import ExploreRecommend from "./screens/RecommendScreen";
import ExploreGroups from "./components/ExploreGroups";
import PinMap from "./components/PinMap";
import CreatedGroupDetail from "./components/CreatedGroupDetail";
import Landing from "./screens/Landing";
import Settings from "./screens/SettingsScreen";
import Settings2 from "./screens/Settings";

import EmailHandler from "./components/EmailHandler";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";


function Main() {
	useEffect(() => {
		const currentTheme = localStorage.getItem("data-theme");
		if (currentTheme) {
			document.documentElement.setAttribute("data-theme", currentTheme);
		} else {
			localStorage.setItem("data-theme", "light");
			document.documentElement.setAttribute("data-theme", "light");
		}
	}, []);

	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={<App />}>
				<Route
					path="/home"
					element={<ProtectedRoute element={HomeScreen} />}
				/>
				<Route
					path="/explore"
					element={<ProtectedRoute element={ExploreScreen} />}
				/>
				<Route
					path="/groups"
					element={<ProtectedRoute element={GroupScreen} />}
				/>
				<Route
					path="/settings2"
					element={<ProtectedRoute element={Settings} />}
				/>
				<Route
					path="/settings"
					element={<ProtectedRoute element={Settings2} />}
				/>
				<Route
					path="/groupMap/:id"
					element={<ProtectedRoute element={GroupsMap} />}
				/>
				<Route
					path="/exploreGroups"
					element={<ProtectedRoute element={ExploreGroups} />}
				/>
				<Route path="/login" element={<LoginScreen />} />{" "}
				<Route path="/signup" element={<SignUpScreen />} />{" "}
				<Route path="/email-handler" element={<EmailHandler />} />
				<Route
					path="/group/:id"
					element={<ProtectedRoute element={GroupDetail} />}
				/>
				<Route
					path="/group/:id/posts"
					element={<ProtectedRoute element={GroupPosts} />}
				/>
				<Route
					path="/post/:id"
					element={<ProtectedRoute element={PinDetail} />}
				/>
				<Route
					path="/profile"
					element={<ProtectedRoute element={Profile} />}
				/>
				<Route
					path="/user_post/:id"
					element={<ProtectedRoute element={UserPostDetails} />}
				/>
				<Route
					path="/saved_post/:id"
					element={<ProtectedRoute element={SavedPostDetails} />}
				/>
				<Route path="/recommend/posts" element={<ExploreRecommend />} />{" "}
				<Route
					path="/recommend/groups"
					element={<ExploreRecommend />}
				/>{" "}
				{/* <Route 
						path="/" 
						element={<ProtectedRoute element={ExploreScreen} />} /> */}
				<Route
					path="/category/:categoryId"
					element={<ProtectedRoute element={CategoryPostsPage} />}
				/>
				<Route
					path="/createdGroup/:id"
					element={<ProtectedRoute element={CreatedGroupDetail} />}
				/>
				<Route path="/" element={<Landing />} index={true} />
				<Route
					path="/profileView/:id"
					element={<ProtectedRoute element={ProfileDetail} />}
				/>
				<Route
					path="/map"
					element={<ProtectedRoute element={PinMap} />}
				/>

				<Route 
					path="/reset-password" 
					element={<ProtectedRoute element={ResetPasswordScreen} />} 
				/>

			</Route>
		)
	);

	return <RouterProvider router={router} />;
}

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(<Main />);
if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("/sw.js")
		.then((registration) => {
			console.log(
				"Service Worker registered with scope:",
				registration.scope
			);
		})
		.catch((error) => {
			console.log("Service Worker registration failed:", error);
		});
}
