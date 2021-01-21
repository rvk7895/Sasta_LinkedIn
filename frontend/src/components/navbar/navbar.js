import React, { useContext, useState } from 'react'
import { Navbar, Button, Nav } from 'react-bootstrap'
import { UserContext } from '../userContext/userContext'
import { Redirect, NavLink } from 'react-router-dom'
import './navbar.css'

const CustomNav = () => {

    const userContext = useContext(UserContext)
    const [redirect, setRedirect] = useState(false)

    const handleSignOut = () => {
        userContext.setId('');
        setRedirect(true);
    }

    return (
        <Navbar className="justify-content-between" >
            <Navbar.Brand>
                Sasta LinkedIn
            </Navbar.Brand>
            <Nav className="justify-content-end">
                <Nav.Item>
                    <Nav.Link >
                        <NavLink exact to={`/jobs/${userContext.id}`} style={{ textDecoration: 'none'}} className="navLinks">
                            Jobs
                        </NavLink>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link >
                        <NavLink exact to={`/applications/${userContext.id}`} style={{ textDecoration: 'none' }} className="navLinks">Applications</NavLink>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item style={{marginRight:"10px"}}>
                    <Nav.Link >
                        <NavLink exact to={`/profile/${userContext.id}`} style={{ textDecoration: 'none'}} className="navLinks">Profile</NavLink>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Button variant="outline-danger" onClick={handleSignOut}>Sign Out</Button>
                    {redirect && <Redirect to="/" />}
                </Nav.Item>
            </Nav>
        </Navbar>
    )
}

export default CustomNav
