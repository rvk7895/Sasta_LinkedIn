import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Jumbotron, Row, Col, Button, Card } from 'react-bootstrap'
import Loader from '../loader/loader';
import CustomNav from '../navbar/navbar'
import { Redirect } from 'react-router-dom'
import { v4 as uid } from 'uuid'

const App = (props) => {
    const [app, setApp] = useState(props.app);
    const [job, setJob] = useState({});
    const [applicant, setApplicant] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {

        const fetchApplicant = async () => {
            try {
                console.log(job.recruiter_id);
                const res = await axios.get(`/api/users/user/${app.app_id}`);
                console.log(res)
                setApplicant(res.data);
            }
            catch (err) {
                console.log(err)
            }
        };

        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/jobs/job/${app.job_id}`)
                console.log(res);
                if (!job._id) setJob(res.data);
                console.log(job);
                if (job._id) {
                    fetchApplicant();
                }
                if (applicant) setLoaded(true);
            }
            catch (err) {
                console.log(err)
            }
        };

        fetchData();
    }, [job])

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
        <div>
            <Card>
                {!loaded ? <Row className="justify-content-center text-center"><Loader /></Row> : <div>
                    <Row style={{ margin: "0.1rem" }}>
                        <Col className="text-center my-auto" lg={4} sm={6} xs={12}>
                            <div><p><span style={{ fontWeight: "bold" }}>Job Title:</span>{` ${job.title}`}</p></div>
                        </Col>
                        <Col className="text-center my-auto" lg={4} sm={6} xs={12}>
                            <Button variant="outline-info" onClick={() => setRedirect(true)} className="mb-1">Applicant Details</Button>
                        </Col>
                        <Col className="text-center my-auto" lg={4} sm={6} xs={12}>
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
                        </Col>
                    </Row>
                </div>}
                {redirect && <Redirect to={`/profile/${applicant._id}`} />}
            </Card>
        </div>
    )
}

const RecApplication = (props) => {

    const [applications, setApplications] = useState();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/applications/rec/${props.match.params.id}`);
                if (!applications) setApplications([...res.data]);
                if (applications) setLoaded(true);
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData();
    }, [applications])

    return (
        <div>
            <Container>
                <CustomNav />
            </Container>
            <Jumbotron>
                <h1>My Applications</h1>
            </Jumbotron>
            <Container>
                {!loaded ? <Row className="justify-content-center"><Loader /></Row> : (
                    <div>
                        {applications.lenght === 0 ? <Row className="justify-content-center text-center">Kisine nahi kia teri jobs mein apply</Row> : (
                            applications.map(app => <App app={app} key={uid()} />)
                        )}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default RecApplication
