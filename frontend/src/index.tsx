import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/index.css";
import App from "./App";
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ExploreScreen from "./screens/ExploreScreen";
import GroupScreen from "./screens/GroupScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import GroupDetail from "./components/GroupDetail";
import PinDetail from "./components/PinDetail";
import Profile from "./screens/Profile";
import UpdatedExplore from "./screens/UpdatedExplore";
import UserPostDetails from "./components/UserPostDetails";
import ProtectedRoute from "./components/ProtectedRoute";

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
                <Route
                    index={true}
                    path="/"
                    element={<ProtectedRoute element={HomeScreen} />}
                />
                <Route
                    path="/explore"
                    element={<ProtectedRoute element={ExploreScreen} />}
                />
                <Route
                    path="/explore2"
                    element={<ProtectedRoute element={UpdatedExplore} />}
                />
                <Route
                    path="/groups"
                    element={<ProtectedRoute element={GroupScreen} />}
                />
                <Route path="/login" element={<LoginScreen />} />{" "}
                <Route path="/signup" element={<SignUpScreen />} />{" "}
                <Route
                    path="/group/:id"
                    element={<ProtectedRoute element={GroupDetail} />}
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
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
}
