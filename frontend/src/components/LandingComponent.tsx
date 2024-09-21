import React from "react";
import "../assets/styles/Landing.css";
import HeroSplash from "../assets/staticImages/DesignSmartAndLaptop.png";
import HeroLogo from "../assets/staticImages/logo.png";
import GetStartedButton from "./GetStartedButton";
import { Link } from "react-router-dom";

const LandingComponent = () => {
	return (
		<div className="Container">
			<div className="Hero">
				<div>
					<h1 className="heroH1">
						<img
							className="HeroLogo"
							src={HeroLogo}
							alt="HeroLogo"
						/>
						The modern way to get in touch with Nature.
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
