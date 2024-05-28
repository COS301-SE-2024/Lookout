import Navigationbar from "./components/Navigationbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

const App = () => {
	return (
		<>
			<nav className="bg-navBkg">
				<Navigationbar />
			</nav>
			<main className="bg-bkg text-content py-3">
				<div className="container mx-auto">
					<Outlet />
				</div>
			</main>
			<footer className="bg-gray-200 p-4">
				<Footer />
			</footer>
		</>
	);
};

export default App;
