const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="flex justify-center py-3">
			<div className="container mx-auto text-center">
				<p>Lookout © {currentYear}</p>
			</div>
		</footer>
	);
};
export default Footer;
