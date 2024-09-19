import Navigationbar from "./components/Navigationbar";
import { Outlet } from "react-router-dom";

import "./assets/styles/nav.css";
import EmailHandler from "./components/EmailHandler";
import WebSocketTest from "./components/WebSocketTest";

const App = () => {
	return (
		<>
			<Navigationbar />
			<main className="bg-bkg text-content w-full min-w-full">
				<div className="container mx-0 w-full min-w-full">
					<Outlet />
					<EmailHandler />
				</div>
			</main>
		</>
	);
};

export default App;
