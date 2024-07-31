import React, { ComponentType } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
	element: ComponentType<any>;
	[key: string]: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	element: Element,
	...rest
}) => {
	const isAuthenticated: boolean = !!Cookies.get("jwt");
	const location = useLocation();

	return isAuthenticated ? (
		<Element {...rest} />
	) : (
		<Navigate to="/explore" state={{ from: location }} />
	);
};

export default ProtectedRoute;
