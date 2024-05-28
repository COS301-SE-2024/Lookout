import { Navbar, Nav, Container} from 'react-bootstrap';
import {FaMap, FaUser, FaUsers } from 'react-icons/fa';
import { FaHouse } from 'react-icons/fa6';
import { LinkContainer } from 'react-router-bootstrap';
import '../assets/styles/nav.css';


const Navigationbar = () => {
    
  return (
    <header>
        <Navbar bg="dark" variant="dark" className="navbar">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                    <LinkContainer to="/">
                        <Nav.Link>
                            <FaHouse/>Home
                        </Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/maps">
                            <Nav.Link>
                                <FaMap/> Maps
                            </Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/groups">
                            <Nav.Link>
                                <FaUsers/>Groups
                            </Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/login">
                            <Nav.Link>
                                <FaUser/> Sign In
                            </Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Navigationbar