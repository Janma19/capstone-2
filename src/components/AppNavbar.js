// Library Utilities
import { useContext} from "react";
import { Link, NavLink } from "react-router-dom";

// User-Defined Utilities
import SessionContext from "../context/SessionContext";

// Library UI Components
import { Container, Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import '../styles/AppNavbar.css';

// The Navbar component serves as the primary navigation UI component for the application. It is rendered on all the pages of the application.
export default function AppNavbar() {
    // It takes the user's information from the SessionContext, it then conditionally renders the Navbar links only to include pages that should be accessible to the user.
    const { user } = useContext(SessionContext);

    // The Home and Products pages are accessible to all users. Authenticated admin users are able to access the Admin Dashboard pages, Profile and Logout. Authenticated non-admin users are able to access the Cart, Orders, Profile and Logout pages. Guest users can access the Login and Register pages.
    return (
        <Navbar className="navbar" expand="lg" fixed="top">
            <Container>
                <Navbar.Brand className="navbar-logo" as={NavLink} to="/">
                    <video
                        src={`${process.env.PUBLIC_URL}/videos/animation.mp4`}
                        autoPlay
                        loop
                        muted
                        preload="auto"
                        style={{ width: '100%', maxWidth: '80px', height: 'auto' }}
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/" className="nav-links">
                            Home
                        </Nav.Link>
                        {user.id !== null ? (
                            <>
                                {user.isAdmin ? (
                                    <NavDropdown title={<span className="nav-dropdown-title">Admin Actions</span>} id="basic-nav-dropdown">
                                        <NavDropdown.Item as={NavLink} to="/products/">
                                            Manage Products
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={NavLink} to="/products/new">
                                            Add New Product
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={NavLink} to="/users">
                                            Manage Users
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={NavLink} to="/orders">
                                            Order History
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                ) : (
                                    <>
                                        <Nav.Link as={NavLink} to="/products" className="nav-links">
                                            Explore Our Beans
                                        </Nav.Link>
                                        <Nav.Link as={NavLink} to="/cart" className="nav-links">
                                            My Cart
                                        </Nav.Link>
                                        <Nav.Link as={NavLink} to="/orders" className="nav-links">
                                            My Orders
                                        </Nav.Link>
                                    </>
                                )}
                                <Nav.Link as={NavLink} to="/profile" className="nav-links">
                                    Profile
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/logout" className="nav-links">
                                    Logout
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={NavLink} to="/products" className="nav-links">
                                    Explore Our Beans
                                </Nav.Link>

                                <Button className="btn" variant="outline-light" as={Link} to="/register">
                                    SIGN UP
                                </Button>
                                <Button className="btn" variant="outline-light" as={Link} to="/login">
                                    SIGN IN
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
