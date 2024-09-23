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
	const isAuthenticated = true;
	const location = useLocation();

	return isAuthenticated ? (
		<Element {...rest} />
	) : (
		<Navigate to="/explore" state={{ from: location }} />
	);
};

export default ProtectedRoute;
