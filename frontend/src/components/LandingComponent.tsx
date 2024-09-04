import React from "react";
import "../assets/styles/Landing.css";
import HeroSplash from "../assets/staticImages/DesignSmartAndLaptop.png";

const LandingComponent = () => {
	return (
		<div className="Container">
			<div className="Hero">
				<h1 className="heroH1">
					The modern way to get in touch with Nature.
				</h1>
				<img className="HeroSplash" src={HeroSplash} alt="HeroSplash" />
			</div>
		</div>
	);
};

export default LandingComponent;
