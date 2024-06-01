import React, { useState } from "react";
import "../assets/styles/ToggleButton.css";

interface ToggleButtonProps {
	onToggle?: (isToggled: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ onToggle }) => {
	const [isToggled, setIsToggled] = useState(false);

	const handleToggle = () => {
		const newToggledState = !isToggled;
		setIsToggled(newToggledState);
		if (onToggle) {
			onToggle(newToggledState);
		}
	};

	return (
		<label className="toggle-switch">
			<input
				type="checkbox"
				checked={isToggled}
				onChange={handleToggle}
			/>
			<span className="slider"></span>
		</label>
	);
};

export default ToggleButton;
