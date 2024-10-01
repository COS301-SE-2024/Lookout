import React from "react";
import "../assets/styles/CustomAlert.css";

interface CustomAlertProps {
	message: string;
	onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => {
	return (
		<div className="custom-alert-overlay">
			<div className="custom-alert">
				<p>{message}</p>
				<button className="custom-alert-button" onClick={onClose}>
					OK
				</button>
			</div>
		</div>
	);
};

export default CustomAlert;
