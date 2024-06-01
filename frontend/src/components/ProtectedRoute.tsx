import React, { ComponentType } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
	element: ComponentType<any>;
	[key: string]: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	element: Element,
	...rest
}) => {
	const isAuthenticated = Boolean(localStorage.getItem("authToken"));
	const location = useLocation();

	return isAuthenticated ? (
		<Element {...rest} />
	) : (
		<Navigate to="/login" state={{ from: location }} />
	);
};

export default ProtectedRoute;
