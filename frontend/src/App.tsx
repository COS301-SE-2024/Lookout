import Navigationbar from "./components/Navigationbar";
import { Outlet } from "react-router-dom";

import "./assets/styles/nav.css";
//import EmailHandler from "./components/EmailHandler";

const App = () => {
	return (
		<>
			<main className="bg-bkg text-content">
				<div className="container mx-0 w-full min-w-full">
					<Navigationbar />
					<Outlet />
				</div>
			</main>
		</>
	);
};

export default App;
