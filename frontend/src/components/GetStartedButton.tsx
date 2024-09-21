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
		<button onClick={onClick} className="GetStartedButton">
			Get Started
		</button>
	);
};

export default GetStartedButton;
