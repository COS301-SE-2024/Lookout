import React, { useEffect, useState } from "react";
import "../assets/styles/ToggleButton.css";

interface ToggleButtonProps {
	onToggle?: (isToggled: boolean) => void;
	initialState?: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
	onToggle,
	initialState = false
}) => {
	const [isToggled, setIsToggled] = useState<boolean>(initialState);

	useEffect(() => {
		if (onToggle) {
			onToggle(isToggled);
		}
	}, [isToggled, onToggle]);

	const handleToggle = () => {
		setIsToggled(!isToggled);
		if (onToggle) {
			onToggle(!isToggled);
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
