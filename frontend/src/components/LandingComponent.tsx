import React from "react";
import "../assets/styles/Landing.css";
import HeroSplash from "../assets/staticImages/DesignSmartAndLaptop.png";
import LightLogo from "../assets/staticImages/logoLight.png";
import DarkLogo from "../assets/staticImages/logoDark.png";
import GetStartedButton from "./GetStartedButton";
import { Link } from "react-router-dom";

const isLightMode = localStorage.getItem("data-theme") === "light" ? true : false;

const LandingComponent = () => {
	return (
		<div className="Container p-4">
			<div className="Hero">
				<div>
					<h1 className="heroH1">
						{isLightMode ? 
						( 
						<img 
						className="HeroLogo"
						src="LightLogo"
						alt="HeroLogo"
						/> ) 
						: (
						<img 
						className="HeroLogo"
						src="DarkLogo"
						alt="HeroLogo"
						/>)}
						Spot. Share. Connect. Explore with Lookout.
						<Link to="/signup" className="linkToSignup">
							<GetStartedButton onClick={() => {}} />
						</Link>
					</h1>
				</div>
				<img className="HeroSplash" src={HeroSplash} alt="HeroSplash" />
			</div>
		</div>
	);
};

export default LandingComponent;
