import Navigationbar from "./components/Navigationbar";
import { Outlet, useLocation } from "react-router-dom";
import ClearDataOnRedirect from "./components/Redirect";

import "./assets/styles/nav.css";
//import EmailHandler from "./components/EmailHandler";

const App = () => {
	const location = useLocation();

	return (
		<>
		<ClearDataOnRedirect />
			<main className="bg-bkg text-content">
				<div className="container mx-0 w-full min-w-full">
				
					{location.pathname !== "/reset-password" && location.pathname !== "/login" && location.pathname !== "/signup" &&  <Navigationbar />}
					<Outlet />
				</div>
			</main>
		</>
	);
};

export default App;
