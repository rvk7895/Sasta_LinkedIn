import React, { useEffect, useState } from 'react'
import { Container, Jumbotron, Row, Col, Button, FormControl, Alert } from 'react-bootstrap'
import CustomNav from '../navbar/navbar'
import axios from 'axios'
import Loader from '../loader/loader'

const MyJob = (props) => {

    const [job, setJob] = useState({});
    const [application, setApplication] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [recruiter, setRecruiter] = useState({});
    const [userRating, setUserRating] = useState(0);
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState();
    let recRating = 0.0;
    const [jobRating, setJobRating] = useState(0);

    useEffect(() => {
        const fetchApplication = async () => {
            const res = await axios.get(`/api/applications/jobs/${props.match.params.id}`);
            setApplication(res.data[0].application);
            setJob(res.data[0].job);
            setRecruiter(res.data[0].recruiter)
            let rating = res.data[0].job.rating.length === 0 ? 0 : res.data[0].job.rating.length === 1 ? res.data[0].job.rating[0].rating : res.data[0].job.rating.reduce((a, b) => a.rating + b.rating) / res.data[0].job.rating.length;
            setJobRating(rating);
        }
        fetchApplication();
    }, []);

    useEffect(() => {
        setLoaded(true);
    }, [recruiter])

    const handleRating = async () => {
        try {
            const res = await axios.post(`/api/jobs/rating`, {
                _id: application.job_id,
                userId: application.app_id,
                rating: userRating
            })

            setMessage(res.data.message);
            setAlert(true);
            console.log(res);

            let flag = true;
            let job_rating = job.rating;
            for (let i = 0; i < job_rating.length; i++) {
                if (job_rating[i].userId === application.app_id) {
                    flag = false;
                    job_rating[i].rating = userRating;
                    setJob({ ...job, rating: [...job_rating] })
                    break;
                }
            }
            if (flag) {
                job_rating.push({ userId: application.app_id, rating: userRating });
                setJob({ ...job, rating: [...job_rating] })
            }

            let jobRating = 0.0;
            for (let i = 0; i < job_rating.length; i++) {
                jobRating = (jobRating + job_rating[i].rating) / job_rating.length;
            }

            console.log(jobRating)
            setJobRating(jobRating);
        }

        catch(err){
            console.log(err);
        }
    }

    return (
        <div>
            <Container>
                <CustomNav />
            </Container>
            {!loaded ? <Row className="justify-content-center"><Loader /></Row> :
                (
                    <div>
                        {!application ? <Row className="text-center">Kahin nahi karta tu kaam</Row> :
                            <div>
                                <Jumbotron>
                                    <h1 className="display-3">{job.title}</h1>
                                </Jumbotron>
                                <Container>
                                    {alert && <Alert onClose={() => setAlert(false)} variant="success" dismissible>
                                        {message}
                                    </Alert>}
                                    <Row>
                                        <Col><span style={{ fontWeight: "bold" }}>{"Recruiter Name : "}</span>{recruiter.name}</Col>
                                    </Row>
                                    <Row>
                                        <Col><span style={{ fontWeight: "bold" }}>{"Recruiter Email : "}</span>{recruiter.email}</Col>
                                    </Row>
                                    <Row>
                                        <Col><span style={{ fontWeight: "bold" }}>{"Salary : "}</span>{job.salary}</Col>
                                    </Row>
                                    <Row>
                                        <Col><span style={{ fontWeight: "bold" }}>{"Type of Job : "}</span>{job.type}</Col>
                                    </Row>
                                    <Row>
                                        <Col><span style={{ fontWeight: "bold" }}>{"Joining Date : "}</span>{application.dateOfJoining}</Col>
                                    </Row>
                                    <Row>
                                        <Col><span style={{ fontWeight: "bold" }}>{"Job Rating : "}</span>{jobRating}</Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <h5>Give Job Rating</h5>
                                    </Row>
                                    <Row>
                                        <Col lg={2} sm={6} xs={12}>
                                            <FormControl as='select' value={userRating} placeholder="Duration" onChange={e => setUserRating(parseInt(e.target.value))}>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </FormControl>
                                        </Col>
                                        <Col lg={2} sm={6} xs={12}>
                                            <Button onClick={handleRating} variant="outline-warning">Give Rating</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        }
                    </div>
                )
            }
        </div>
    )
}

export default MyJob
