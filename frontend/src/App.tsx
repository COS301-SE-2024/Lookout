import Navigationbar from "./components/Navigationbar";
import { Outlet } from "react-router-dom";
import './assets/styles/nav.css'

const App = () => {
	return (
		<>
			<Navigationbar />
			<main className="bg-bkg text-content">
				<div className="container mx-0">
					<Outlet />
				</div>
			</main>
		</>
	);
};

export default App;
