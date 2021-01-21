import React from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Jumbotron from 'react-bootstrap/Jumbotron'

const landing = () => {
    return (
        <div>
            <Jumbotron>
                <h1>
                    Sasta LinkedIn
                </h1>
            </Jumbotron>
            <Container fluid className='align-items-center justify-content-center'>
                <Row className='justify-content-center align-items-center'>
                    <Col lg='2' xs='12'>
                        <Link to='/signIn'>
                            <Button size='lg' style={{ marginTop: "5px" }} block>
                                Sign In
                    </Button>
                        </Link>
                    </Col>
                    <Col lg='2' xs='12'>
                        <Link to='/signUp'>
                            <Button size='lg' style={{ marginTop: "5px" }} block>
                                Sign Up
                </Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default landing;