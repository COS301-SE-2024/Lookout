import { Container } from "react-bootstrap"
import Navigationbar from "./components/Navigationbar"
import Footer from "./components/Footer";
import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <>
    <Navigationbar />
    <main className="py-3">
      <Container>
        <Outlet />
      </Container>
    </main>
    <Footer />
    </>
  );
};

export default App