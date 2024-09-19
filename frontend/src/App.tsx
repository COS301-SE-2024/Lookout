import Navigationbar from "./components/Navigationbar";
import { Outlet } from "react-router-dom";

import "./assets/styles/nav.css";
import EmailHandler from "./components/EmailHandler";
import WebSocketTest from "./components/WebSocketTest";

const App = () => {
	return (
		<>
			<main className="bg-bkg text-content">
				<div className="container mx-0">
					<Navigationbar />
					<Outlet />
					<EmailHandler />
					{/* <WebSocketTest /> */}
				</div>
			</main>
		</>
	);
};

export default App;
