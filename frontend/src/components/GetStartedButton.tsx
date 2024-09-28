import React from "react";
import "../assets/styles/Landing.css";

interface GetStartedButtonProps {
	onClick: () => void;
	className?: string;
}

const GetStartedButton: React.FC<GetStartedButtonProps> = ({
	onClick,
	className = ""
}) => {
	return (
		<button onClick={onClick} className="GetStartedButton rounded-md bg-navBkg2 text-nav hover:bg-nav hover:text-content hover:border hover:border-content">
			Get Started
		</button>
	);
};

export default GetStartedButton;
