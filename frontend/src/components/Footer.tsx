const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="flex justify-center py-3 bg-gray-200 p-4">
			<div className="container mx-auto text-center">
				<p>Lookout © {currentYear}</p>
			</div>
		</footer>
	);
};
export default Footer;
