import React from "react";
import "../assets/styles/Landing.css";
import LightLogo from "../assets/icons/Green-Transparent.png";
import DarkLogo from "../assets/icons/Blue-Transparent.png";
import HeroLight from "../assets/staticImages/HeroLookoutLight.svg";
import HeroDark from "../assets/staticImages/HeroLookoutDark.svg";
import GetStartedButton from "./GetStartedButton";
import { Link } from "react-router-dom";

const isLightMode =
	localStorage.getItem("data-theme") === "light" ? true : false;

const LandingComponent = () => {
	return (
		<div className="Container p-4">
			<div className="Hero">
				<div>
					<h1 className="heroH1">
						{isLightMode ? (
							<img
								className="HeroLogo"
								src={LightLogo}
								alt="HeroLogo"
							/>
						) : (
							<img
								className="HeroLogo"
								src={DarkLogo}
								alt="HeroLogo"
							/>
						)}
						Spot. Share. Connect. Explore with Lookout.
						<Link to="/signup" className="linkToSignup">
							<GetStartedButton onClick={() => {}} />
						</Link>
					</h1>
				</div>
				{isLightMode ? (
					<img
						className="HeroSplash"
						src={HeroLight}
						alt="HeroSplash"
					/>
				) : (
					<img
						className="HeroSplash"
						src={HeroDark}
						alt="HeroSplash"
					/>
				)}
			</div>
		</div>
	);
};

export default LandingComponent;
