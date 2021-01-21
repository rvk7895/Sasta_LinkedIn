import React, { useState, useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { Alert, Container, Jumbotron, Form, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'
import jwt_decode from "jwt-decode";
import { UserContext } from '../userContext/userContext'

const SingIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [alert, setAlert] = useState(false);
    const [error, setError] = useState('');
    const userContext = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/users/login', {
                password,
                email
            })
            if (res.data.status === 800) {
                setError(res.data.message);
                setAlert(true);
            }
            if (res.data.status === 200) {
                const user = jwt_decode(res.data.token);
                userContext.setId(user.id);
                userContext.setRole(user.role);
                console.log(user)
                localStorage.setItem('LinkedInid',user.id);
                localStorage.setItem('LinkedInRole',user.role);
                setRedirect(true);
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <Jumbotron>
                <h1>Sign In</h1>
            </Jumbotron>
            <Alert>

            </Alert>
            <Container className='align-item-center'>
                {alert &&
                    <Alert variant='danger' onClose={() => setAlert(false)} dismissible>
                        {error}
                    </Alert>
                }
                <form onSubmit={handleSubmit}>
                    <Form.Group controlId='formEmail' className="justify-content-center mb-3">
                        <Row>
                            <Form.Label column sm={12} style={{ fontSize: '20px' }}>Email</Form.Label>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Form.Control type='email' value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group controlId='formPassword1' className="justify-content-center mb-3">
                        <Row>
                            <Form.Label column sm={12} style={{ fontSize: '20px' }}>Password</Form.Label>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Form.Control type='password' value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Row className="justify-content-center">
                        <Col className="text-center">
                            <Button variant="primary" type="submit" className="mb-3">
                                Login
                            </Button>
                        </Col>
                        <Col className="text-center">
                            <Link to='/'>
                                <Button variant="danger" className="mb-3">Go Back</Button>
                            </Link>
                        </Col>
                    </Row>
                </form>
            </Container>
            {redirect && <Redirect to={`/profile/${userContext.id}`} />}
        </div>
    )
}

export default SingIn
