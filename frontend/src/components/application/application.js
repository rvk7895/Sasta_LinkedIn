import React, { useState, useEffect } from 'react'
import { Container, Jumbotron, Row, Card, Col } from 'react-bootstrap';
import CustomNav from '../navbar/navbar';
import axios from 'axios'
import Loader from '../loader/loader';
import { v4 as uid } from 'uuid'

const App = (props) => {

    const [app, setApp] = useState(props.app);
    const [job, setJob] = useState({});
    const [recruiter, setRecruiter] = useState({});
    const [modal, setModal] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {

        const fetchRecruiter = async () => {
            try {
                console.log(job.recruiter_id);
                const res = await axios.get(`/api/users/user/${job.recruiter_id}`);
                console.log(res)
                setRecruiter(res.data);
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
                    fetchRecruiter();
                }
                if (recruiter) setLoaded(true);
            }
            catch (err) {
                console.log(err)
            }
        };

        fetchData();
    }, [job])

    return (
        <div>
            <Card>
                {!loaded ? <Row className="justify-content-center text-center"><Loader /></Row> : <div>
                    <Row style={{ margin: "0.1rem" }}>
                        <Col className="text-center">
                            <p><span style={{fontWeight:"bold"}}>Job Title:</span>{` ${job.title}`}</p>
                        </Col>
                        <Col className="text-center">
                            <p><span style={{fontWeight:"bold"}}>Recruiter Name:</span>{` ${recruiter.name}`}</p>
                        </Col>
                        <Col className="text-center">
                            <p><span style={{fontWeight:"bold"}}>Recruiter Email:</span>{` ${recruiter.email}`}</p>
                        </Col>
                        <Col className="text-center">
                            <span style={{fontWeight:"bold"}}>Status:</span>{app.status === 'accepted' ? <p style={{ color: "green" }}> Accepted</p> :
                                app.status === 'rejected' || app.status === 'deleted' ? <p style={{ color: "red" }}>{` ${app.status.charAt(0).toUpperCase() + app.status.substr(1).toLowerCase()}`}</p> :
                                    <p> Pending</p>}
                        </Col>
                    </Row>
                </div>}
            </Card>
        </div>
    )
}

const Application = (props) => {
    const [applications, setApplications] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/applications/app/${props.match.params.id}`)
                console.log(res);
                console.log(applications.length)
                setApplications(res.data);
                if (applications) setLoaded(true);
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData();
    }
        , [props])

    return (
        <div>
            <Container>
                <CustomNav />
            </Container>
            <Jumbotron>
                <h1>My Applications</h1>
            </Jumbotron>
            <div style={{ margin: "40px" }} />
            <Container>
                {!loaded ? <Row className="justify-content-center"><Loader /></Row> : (
                    <div>
                        {applications.length === 0 ? <Row className="text-center justify-content-center">Kahin apply nahi kia toh yahan par kyon aaye ho puttar</Row> : (
                            <div>
                                {applications.map(app => <App key={uid()} app={app} />)}
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default Application
