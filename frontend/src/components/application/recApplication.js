import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Jumbotron, Row, Col, Button, Card, Modal, Badge, Dropdown } from 'react-bootstrap'
import Loader from '../loader/loader';
import CustomNav from '../navbar/navbar'
import { Redirect } from 'react-router-dom'
import { v4 as uid } from 'uuid'

const App = (props) => {
    const [app, setApp] = useState(props.app);
    const [job, setJob] = useState(props.job);
    const [applicant, setApplicant] = useState(props.applicant);
    const [loaded, setLoaded] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [modal, setModal] = useState(false);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        setLoaded(true);
    }, [app]);

    const handleSuccess = async () => {
        if (app.status === 'pending') {
            try {
                const res = await axios.post('/api/applications/shortlist', {
                    app_id: applicant._id,
                    job_id: job._id
                });
                setApp({ ...app, status: "shortlisted" });
                console.log(res);
            }
            catch (err) {
                console.log(err)
            }
        }

        if (app.status === 'shortlisted') {
            try {
                const res = await axios.post('/api/applications/accept', {
                    app_id: applicant._id,
                    job_id: job._id
                });
                setApp({ ...app, status: "accepted" });
                console.log(res);
            }
            catch (err) {
                console.log(err)
            }
        }
    }

    const handleReject = async () => {
        try {
            const res = await axios.post('/api/applications/reject', {
                app_id: applicant._id,
                job_id: job._id
            });
            setApp({ ...app, status: "rejected" });
            console.log(res);
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="mb-3">
            <Card style={{ minHeight: "70px" }}>
                {!loaded ? <Row className="justify-content-center text-center"><Loader /></Row> : <div>
                    <Row style={{ margin: "0.1rem" }}>
                        <Col className="my-auto">
                            <Row>
                                <Col>
                                    <h3>{applicant.name}</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col>
                                            Educational Insitutes
                                        </Col>
                                    </Row>
                                    {applicant.insti.map(ins =>
                                        <div key={uid()}>
                                            <Card className="mb-1">
                                                <Card.Body>
                                                    <Row>
                                                        <Col sm={12}>
                                                            <h4>{ins.name}</h4>
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-0">
                                                        <Col sm={12} className="text-left">
                                                            {ins.starty} - {ins.endy}
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    )}
                                </Col>
                                <Col className="text-center">
                                    <Row>
                                        <Col>
                                            Skills Possessed
                                        </Col>
                                    </Row>
                                    <div>
                                        {applicant.skills.map(skill => <Badge key={uid()} pill variant="info" style={{ margin: "5px", fontSize: "15px" }}>{skill.name}</Badge>)}
                                    </div>
                                </Col>
                                <Col lg={2} xs={12}>
                                    <p>Applied on :{` ${app.applyingDate.getDate()}-${app.applyingDate.getMonth() + 1}-${app.applyingDate.getFullYear()}`}</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="text-center my-auto" lg={3} sm={3} xs={12}>
                            <Row className="justify-content-center text-center">
                                <h5>Status :{` ${app.status}`}</h5>
                            </Row>
                            <Row className="justify-content-center">
                                <Button variant="outline-warning" className="mb-1" onClick={() => setModal(true)} >View SOP</Button>
                            </Row>
                            <Row className="justify-content-center">
                                {app.status === 'rejected' ? <Col className="justify-content-center text-center my-auto"><Button variant="danger" className="mb-1" disabled>Rejected</Button></Col> : (
                                    <div>
                                        <Col className="text-center justift-content-center my-auto">
                                            <Button disabled={app.status === 'accepted' ? true : false} variant="success" onClick={handleSuccess} className="mb-1">
                                                {app.status === 'pending' ? 'Shortlist' : 'Accept'}
                                            </Button>
                                        </Col>
                                        <Col className="text-center justift-content-center my-auto">
                                            <Button variant="danger" disabled={app.status === 'accepted' ? true : false} onClick={handleReject} className="mb-1">Reject</Button>
                                        </Col>
                                    </div>
                                )}
                            </Row>
                            <Row className="justify-content-center">
                                <Button download={`${applicant.name}_CV.pdf`} href={applicant.CV} disabled={applicant.CV === '' ? true : false}>Download CV</Button>
                            </Row>
                        </Col>
                    </Row>
                </div>}
                {redirect && <Redirect to={`/profile/${applicant._id}`} />}
            </Card>
            <Modal centered size="lg" show={modal} onHide={() => setModal(false)}>
                <Modal.Header closeButton>
                    <h3>
                        SOP
                    </h3>
                </Modal.Header>
                <Modal.Body>
                    {app.SOP}
                </Modal.Body>
            </Modal>
        </div>
    )
}

const RecApplication = (props) => {

    const [applications, setApplications] = useState([]);
    const [visibleApps, setVisibileApps] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [job, setJob] = useState();
    const [order, setOrder] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/applications/job/${props.match.params.id}`);
                console.log(res.data);
                res.data = res.data.map(user => {
                    let displayRating = user.applicant.rating.length === 0 ? 0 : user.applicant.rating.length === 1 ? user.applicant.rating[0].rating : user.applicant.rating.reduce((a, b) => a.rating + b.rating) / user.rating.length;
                    let applyingDate = new Date(user.application.applyingDate);
                    return { applicant: { ...user.applicant }, application: { ...user.application, applyingDate }, displayRating };
                })
                setApplications([...res.data]);
                setVisibileApps([...res.data]);
                const res2 = await axios.get(`/api/jobs/job/${props.match.params.id}`);
                console.log(res2.data);
                setJob(res2.data);
                if (job) setLoaded(true)
                // console.log(res2.data);
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        setLoaded(true);
    }, [job])

    useEffect(() => {
        setLoaded(false);
        let sorted = applications;
        if (order === "Name Ascending") sorted.sort((a, b) => a.applicant.name < b.applicant.name ? -1 : 1);
        if (order === "Name Descending") sorted.sort((a, b) => a.applicant.name > b.applicant.name ? -1 : 1);
        if (order === "Date of Applying Ascending") sorted.sort((a, b) => a.application.applyingDate < b.application.applyingDate ? -1 : 1);
        if (order === "Date of Applying Descending") sorted.sort((a, b) => a.application.applyingDate > b.application.applyingDate ? -1 : 1);
        if (order === "Rating Ascending") sorted.sort((a, b) => a.displayRating < b.displayRating ? -1 : 1);
        if (order === "Rating Descending") sorted.sort((a, b) => a.displayRating > b.displayRating ? -1 : 1);

        setVisibileApps([...sorted]);
        if (visibleApps && job) setLoaded(true);
    }, [order])

    return (
        <div>
            <Container>
                <CustomNav />
            </Container>
            {!loaded ? <Row className="justify-content-center"><Loader /></Row> : (<div>
                <Jumbotron>
                    <h1>{`${job.title} `}Applications</h1>
                </Jumbotron>
                <Container>
                    <Row className="justify-content-end text-center mb-3">
                        <Col className="justify-content-center text-center">
                            <Dropdown>
                                <Dropdown.Toggle variant="secondary" block style={{ maxWidth: "300px" }}>
                                    {order === '' ? "Order" : order}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {["Name Ascending", "Name Descending", "Date of Applying Ascending", "Date of Applying Descending", "Rating Ascending", "Rating Descending"].map(x =>
                                        <Dropdown.Item key={x} onClick={() => setOrder(x)}>{x}</Dropdown.Item>)}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col className="text-right">
                            <Button variant="outline-warning" onClick={() => setOrder('')}>Clear Filters</Button>
                        </Col>
                    </Row>
                    {visibleApps.length === 0 ? <Row className="justify-content-center text-center">Kisine nahi kia teri jobs mein apply</Row> : (
                        applications.map(app => app.application.status === 'rejected' ? null : <App app={app.application} applicant={app.applicant} job={job} key={app.application._id} displayRating={app.displayRating} />)
                    )}
                </Container>
            </div>
            )}
        </div>
    )
}

export default RecApplication
