import React, { useState, useContext } from 'react'
import { Link} from 'react-router-dom'
import { Container, Form, Jumbotron, Col, Row, Button, Alert } from 'react-bootstrap';
import { UserContext } from '../userContext/userContext'
import axios from 'axios';

const SignUp = () => {

    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState()
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [registered, setRegistered] = useState(false);
    const { id, setId } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/users/register', {
                name,
                password,
                password2,
                email,
                role
            })
            if (res.data.status === 800) {
                setMessage(res.data.message);
                setAlert(true);
            }
            if (res.data.status === 200) {
                setAlert(false);
                setRegistered(true);
            }
            console.log(res);
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <Jumbotron>
                <h1 className="display-3">
                    Sign Up
                </h1>
            </Jumbotron>
            <Container className="align-items-center">
                {alert &&
                    <Alert variant='danger' onClose={() => setAlert(false)} dismissible>
                        {message}
                    </Alert>
                }

                {registered &&
                    <Alert variant='success' onClose={() => setRegistered(false)} dismissible>
                        You have been registered, head to the Sign In page to sign in!
                        </Alert>
                }
                <form onSubmit={handleSubmit}>
                    <Form.Group controlId='formName' className="justify-content-center mb-3">
                        <Row>
                            <Form.Label column sm={12} style={{ fontSize: '20px' }}>Name</Form.Label>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Form.Control type='text' value={name} placeholder="Name" onChange={e => setName(e.target.value)} />
                            </Col>
                        </Row>
                    </Form.Group>
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
                    <Form.Group controlId='formPassword2' className="justify-content-center mb-3">
                        <Row>
                            <Form.Label column sm={12} style={{ fontSize: '20px' }}>Confirm Password</Form.Label>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Form.Control type='password' value={password2} placeholder="Password" onChange={e => setPassword2(e.target.value)} />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group controlId='formPassword2' className="justify-content-center mb-3">
                        <Row>
                            <Form.Label column sm={12} style={{ fontSize: '20px' }}>Role</Form.Label>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Form.Control as='select' onChange={e => setRole(e.target.value)}>
                                    <option value=""></option>
                                    <option value="applicant">Applicant</option>
                                    <option value="recruiter">Recruiter</option>
                                </Form.Control>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Row className="justify-content-center">
                        <Col className="text-center">
                            <Button variant="primary" type="submit" className="mb-3">
                                Register
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
        </div>
    )
}

export default SignUp
