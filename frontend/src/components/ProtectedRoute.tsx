import React, { ComponentType } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getEmailFromLocalStorage } from "../utils/auth";

interface ProtectedRouteProps {
	element: ComponentType<any>;
	[key: string]: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	element: Element,
	...rest
}) => {
	const email = getEmailFromLocalStorage();

	const isAuthenticated = Boolean(email);
	const location = useLocation();

	return isAuthenticated ? (
		<Element {...rest} />
	) : (
		<Navigate to="/login" state={{ from: location }} />
	);
};


export default ProtectedRoute;
