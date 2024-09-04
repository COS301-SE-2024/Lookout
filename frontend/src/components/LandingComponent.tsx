import React from "react";
import "../assets/styles/Landing.css";
import HeroSplash from "../assets/staticImages/DesignSmartAndLaptop.png";
import GetStartedButton from "./GetStartedButton";

const LandingComponent = () => {
	return (
		<div className="Container">
			<div className="Hero">
				<div>
					<h1 className="heroH1">
						The modern way to get in touch with Nature.
						<GetStartedButton
							onClick={function (): void {
								throw new Error("Function not implemented.");
							}}
						/>
					</h1>
				</div>
				<img className="HeroSplash" src={HeroSplash} alt="HeroSplash" />
			</div>
		</div>
	);
};

export default LandingComponent;
