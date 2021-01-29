import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Container, Jumbotron, Row, Col, Button, Modal, FormControl, Alert, Dropdown } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Loader from '../loader/loader';
import CustomNav from '../navbar/navbar';

const Employee = (props) => {

    const [employee, setEmployee] = useState(props.employee);
    const [applicant, setApplicant] = useState(props.applicant);
    const [job, setJob] = useState(props.job);
    const [loaded, setLoaded] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [modal, setModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [displayRating, setDisplayRating] = useState(props.displayRating);
    const { setMessage, setAlert, employees, setEmployees } = props;
    let netRating = 0.0;

    useEffect(() => {
        setLoaded(false)
        console.log(props.displayRating)
        if (applicant && job) setLoaded(true);
    }, [])

    const handleRating = async () => {
        try {
            const res = await axios.post(`/api/users/rating`, {
                _id: employee.app_id,
                userId: employee.rec_id,
                rating
            })
            setMessage(res.data.message);
            setAlert(true);
            setModal(false);
            console.log(res);

            props.handleRating(employee.app_id, rating);
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="mb-3">
            <Card>
                {!loaded ? <Row className="justify-content-center"><Loader /></Row> : (
                    <div>
                        <Row style={{ margin: "0.1rem" }}>
                            <Col lg={12} sm={12}>
                                <h3>{applicant.name}</h3>
                            </Col>
                        </Row>
                        <Row style={{ margin: "0.1rem" }} className="mb-3">
                            <Col lg={3} sm={12} xs={12}><span style={{ fontWeight: "bold" }}>Job title:</span>{` ${job.title}`}</Col>
                            <Col lg={3} sm={12} xs={12} className="text-center"><span style={{ fontWeight: "bold" }}>Date of Joining:</span>{` ${` ${employee.dateOfJoining.getDate()}`}-${employee.dateOfJoining.getMonth() + 1}-${employee.dateOfJoining.getFullYear()}`}</Col>
                            <Col lg={3} sm={12} xs={12} className="text-center"><span style={{ fontWeight: "bold" }}>Job type:</span>{` ${job.type}`}</Col>
                            <Col lg={3} sm={12} xs={12} className="text-right"><span style={{ fontWeight: "bold" }}>Rating:</span>{` ${displayRating}`}</Col>
                        </Row>
                        <Row style={{ margin: "0.1rem" }} className="justify-content-center mb-3">
                            <Col lg={6} sm={12} xs={12} className="text-center">
                                <Button variant="outline-info" onClick={() => setRedirect(true)}>View Profile</Button>
                            </Col>
                            <Col lg={6} sm={12} xs={12} className="text-center">
                                <Button variant="outline-warning" onClick={() => setModal(true)}>Give Rating</Button>
                            </Col>
                        </Row>
                    </div>
                )}
            </Card>
            <Modal show={modal} onHide={() => setModal(false)} centered>
                <Modal.Header closeButton>
                    <h3>
                        Give Rating
                    </h3>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mb-3">
                        <Col>
                            <FormControl as='select' value={rating} placeholder="Duration" onChange={e => setRating(parseInt(e.target.value))}>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </FormControl>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button onClick={handleRating} variant="success" block>Submit</Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
            {redirect && <Redirect to={`/profile/${applicant._id}`} />}
        </div>
    )
};

const Employees = (props) => {

    const [employees, setEmployees] = useState([]);
    const [visibleEmployees, setVisibleEmployees] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [message, setMessage] = useState('');
    const [alert, setAlert] = useState('');
    const [order, setOrder] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            setLoaded(false);
            const res = await axios.get(`/api/applications/employees/${props.match.params.id}`);
            res.data = res.data.map(user => {
                let displayRating = user.applicant.rating.length === 0 ? 0 : user.applicant.rating.length === 1 ? user.applicant.rating[0].rating : user.applicant.rating.reduce((a, b) => a.rating + b.rating) / user.rating.length;
                let applyingDate = new Date(user.application.applyingDate);
                let dateOfJoining = new Date(user.application.dateOfJoining);
                return { applicant: { ...user.applicant }, application: { ...user.application, applyingDate, dateOfJoining }, displayRating, job: { ...user.job } };
            });
            setEmployees([...res.data]);
            setVisibleEmployees([...res.data]);
            console.log(res.data);
        };
        fetchData();
    }, [])

    const handleRating = (id, rating) => {
        setLoaded(false)
        let arr = employees.map(employee => {
            if (employee.applicant._id === id) {
                let flag = true;
                let app_rating = employee.applicant.rating;
                for (let i = 0; i < app_rating.length; i++) {
                    if (app_rating[i].userId === employee.application.rec_id) {
                        flag = false;
                        app_rating[i].rating = rating;
                        employee.applicant.rating = [...app_rating]
                        break;
                    }
                }
                if (flag) {
                    app_rating.push({ userId: employee.application.rec_id, rating: rating });
                    employee.applicant.rating = [...app_rating]
                }

                let netRating = 0.0;
                for (let i = 0; i < app_rating.length; i++) {
                    netRating = (netRating + app_rating[i].rating) / app_rating.length;
                }
                employee.displayRating = netRating;

                return { application: employee.application, job: employee.job, applicant: { ...employee.applicant, displayRating: netRating }, displayRating: netRating }
            }
            else return employee
        })
        setEmployees([...arr]);
        setVisibleEmployees([...arr]);
    }

    useEffect(() => {
        setLoaded(true);
    }, [visibleEmployees])

    useEffect(() => {
        setLoaded(false);
        let sorted = employees;
        if (order === "Name Ascending") sorted.sort((a, b) => a.applicant.name < b.applicant.name ? -1 : 1);
        if (order === "Name Descending") sorted.sort((a, b) => a.applicant.name > b.applicant.name ? -1 : 1);
        if (order === "Date of Joining Ascending") sorted.sort((a, b) => a.application.dateOfJoining < b.application.dateOfJoining ? -1 : 1);
        if (order === "Date of Joining Descending") sorted.sort((a, b) => a.application.dateOfJoining > b.application.dateOfJoining ? -1 : 1);
        if (order === "Rating Ascending") sorted.sort((a, b) => a.displayRating < b.displayRating ? -1 : 1);
        if (order === "Rating Descending") sorted.sort((a, b) => a.displayRating > b.displayRating ? -1 : 1);
        if (order === "Job Title Ascending") sorted.sort((a,b)=> a.job.title < b.job.title ? -1 : 1)
        if (order === "Job Title Descending") sorted.sort((a,b)=> a.job.title > b.job.title ? -1 : 1)

        setVisibleEmployees([...sorted]);
        if (visibleEmployees) setLoaded(true);
    }, [order])

    return (
        <div>
            <Container>
                <CustomNav />
            </Container>
            <Jumbotron>
                <h1 className="display-3">My Employees</h1>
            </Jumbotron>
            <Container>
                <div style={{ margin: "40px" }} />
                {alert &&
                    <Alert onClose={() => setAlert(false)} variant="success" dismissible>
                        {message}
                    </Alert>
                }
                {!loaded ? <Row className="justify-content-center"><Loader /></Row> : (
                    <div>
                        {employees.length ? <div>
                            <Row className="justify-content-end text-center mb-3">
                                <Col lg={6} className="justify-content-center text-center">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" block style={{ maxWidth: "300px" }}>
                                            {order === '' ? "Order" : order}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {["Name Ascending", "Name Descending", "Date of Joining Ascending", "Date of Joining Descending", "Rating Ascending", "Rating Descending", "Job Title Ascending", "Job Title Descending"].map(x =>
                                                <Dropdown.Item key={x} onClick={() => setOrder(x)}>{x}</Dropdown.Item>)}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                                <Col className="text-right">
                                    <Button variant="outline-warning" onClick={() => setOrder('')}>Clear Filters</Button>
                                </Col>
                            </Row>
                            {visibleEmployees.map(x => <Employee key={x.applicant._id} employee={x.application} applicant={x.applicant} job={x.job} setMessage={setMessage} setAlert={setAlert} handleRating={handleRating} displayRating={x.displayRating} />)}
                        </div> : <Row className="justify-content-center">Koi tere lie nahi karta kaam</Row>}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default Employees
