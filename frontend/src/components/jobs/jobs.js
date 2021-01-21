import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Jumbotron, Row, Card, Col, Badge, Button, Modal, FormControl, Alert, Dropdown } from 'react-bootstrap';
import CustomNav from '../navbar/navbar';
import Loader from '../loader/loader';
import { v4 as uid } from 'uuid';
import Fuse from 'fuse.js'

const Job = (props) => {

    const { job, app_id, setAlert } = props;
    const [recruiter, setRecruiter] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [modal, setModal] = useState(false);
    const [SOP, setSOP] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/users/user/${job.recruiter_id}`);
                setRecruiter(res.data)
                if (recruiter) setLoaded(true);
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData();
    }, []);

    const handleSubmit = async () => {
        try {
            const res = await axios.post('/api/applications/apply', {
                app_id,
                job_id: job._id,
                SOP,
                rec_id: job.recruiter_id
            });
            console.log(res.data)
            setModal(false);
            setAlert(true)

        }
        catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <Card className="mb-3">
                {!loaded ? <Row className="justify-content-center"><Loader /></Row> : (
                    <div>
                        <Row style={{ margin: "0.1rem" }}>
                            <Col lg={12} sm={12}>
                                <h3>{job.title}</h3>
                            </Col>
                        </Row>
                        <Row style={{ margin: "0.1rem" }}>
                            <Col lg={12} sm={12}>
                                <span style={{ fontWeight: "bold" }}>Recruiter Name:</span>{` ${recruiter.name}`}
                            </Col>
                        </Row>
                        <Row style={{ margin: "0.1rem" }}>
                            <Col lg={12} sm={12}>
                                <span style={{ fontWeight: "bold" }}>Recruiter Email:</span>{` ${recruiter.email}`}
                            </Col>
                        </Row>
                        <Row style={{ margin: "0.1rem" }}>
                            <Col lg={2} sm={6} xs={6}><span style={{ fontWeight: "bold" }}>Salary:</span>{` ${job.salary}`}</Col>
                            <Col lg={2} sm={6} xs={6}><span style={{ fontWeight: "bold" }}>Type:</span>{` ${job.type}`}</Col>
                            <Col lg={2} sm={6} xs={6}><span style={{ fontWeight: "bold" }}>Duration:</span>{job.duration === 0 ? " Indefinite" : ` ${job.duration} Months`}</Col>
                            <Col lg={2} sm={6} xs={6}><span style={{ fontWeight: "bold" }}>Deadline:</span>{` ${` ${job.deadline.getDate()}`}-${job.deadline.getMonth()+1}-${job.deadline.getFullYear()}`}</Col>
                            <Col lg={2} sm={6} xs={6}><span style={{ fontWeight: "bold" }}>Positions Left:</span>{` ${job.pos_left}`}</Col>
                            <Col lg={2} sm={6} xs={6}><span style={{ fontWeight: "bold" }}>Applications Left:</span>{` ${job.app_left}`}</Col>
                        </Row>
                        <Row style={{ margin: "0.1rem" }}>
                            <Col lg={6} sm={12} xs={12}>
                                <span style={{ fontWeight: "bold" }}>Required Skills:</span>{job.req_skills.map(skill => <Badge key={uid()} pill variant="info" style={{ margin: "0.1rem" }}>{skill}</Badge>)}
                            </Col>
                            <Col lg={4} sm={12} xs={12}>
                                <span style={{ fontWeight: "bold" }}>Rating: </span>TODO
                             </Col>
                            <Col lg={2} sm={12} xs={12}>
                                <Button variant="success" onClick={() => setModal(true)} disabled={!job.pos_left || !job.app_left ? true : false} block>Apply</Button>
                            </Col>
                        </Row>
                        <Modal centered size="lg" show={modal} onHide={() => setModal(false)}>
                            <Modal.Header closeButton>
                                <h3>
                                    Applying for {job.title}
                                </h3>
                            </Modal.Header>
                            <Modal.Body>
                                <span style={{ fontWeight: "bold" }}>Write and SOP of atleast 250 words</span>
                                <FormControl as="textarea" rows={3} placeholder="SOP" value={SOP} style={{ margin: "0.1rem" }} onChange={e => setSOP(e.target.value)} />
                                <Button onClick={handleSubmit} variant="success" disabled={SOP.length < 10 ? true : false} style={{ marginTop: "0.5rem" }} block> Submit </Button>
                            </Modal.Body>
                        </Modal>
                    </div>)}
            </Card>
        </div>
    )
}

const Jobs = (props) => {

    const [jobs, setJobs] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [alert, setAlert] = useState(false);
    const [visibleJobs, setVisibleJobs] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        typeOfJob: '',
        maxSalary: '',
        minSalary: '',
        order: '',
        duration: 0
    })
    const [minSalary, setMinSalary] = useState('');
    const [maxSalary, setMaxSalary] = useState('');
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/jobs/all');
                res.data = res.data.map(data => { const deadline = new Date(data.deadline); return { ...data, deadline } })
                const res2 = await axios.get(`/api/applications/app/${props.match.params.id}`)
                console.log(res2)
                let jobsNotApplied = [];
                for (let i = 0; i < res.data.length; i++) {
                    let applied = false;
                    for (let j = 0; j < res2.data.length; j++) {
                        if (res2.data[j].job_id === res.data[i]._id) applied = true;
                    }
                    if (!applied) jobsNotApplied.push(res.data[i]);
                }
                setJobs(jobsNotApplied);
                setVisibleJobs(jobsNotApplied);
                if (jobs) setLoaded(true);
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData();
    }, [])


    useEffect(() => {
        let filtered = jobs;
        setLoaded(false);

        //search
        const fuseOptions = {
            keys: ['title']
        }

        const fuse = new Fuse(filtered, fuseOptions);
        if (filters.search !== '') {
            const result = fuse.search(filters.search)
            filtered = result.map(searchResults => searchResults.refIndex).map(idx => filtered[idx])
        }

        if (filters.typeOfJob !== '') filtered = filtered.filter(job => job.type === filters.typeOfJob);
        if (filters.minSalary !== '') filtered = filtered.filter(job => job.salary >= parseInt(filters.minSalary));
        if (filters.maxSalary !== '') filtered = filtered.filter(job => job.salary <= parseInt(filters.maxSalary));
        if (filters.duration !== 0) filtered = filtered.filter(job => job.duration < filters.duration);

        //order
        if (filters.order === "Salary Ascending") filtered.sort((a, b) => { console.log("heelo"); return a.salary - b.salary })
        if (filters.order === "Salary Descending") filtered.sort((a, b) => -(a.salary - b.salary))
        if (filters.order === "Duration Ascending") filtered.sort((a, b) => a.duration - b.duration)
        if (filters.order === "Duration Descending") filtered.sort((a, b) => -(a.duration - b.duration))
        if (filters.order === "Rating Ascending") filtered.sort((a, b) => a.rating - b.rating)
        if (filters.order === "Rating Descending") filtered.sort((a, b) => -(a.rating - b.rating))
        setVisibleJobs([...filtered]);
        if (visibleJobs) setLoaded(true);
    }, [filters, filters.order, jobs]);

    return (
        <div>
            <Container>
                <CustomNav />
            </Container>
            <Jumbotron>
                <h1>Job Listings</h1>
            </Jumbotron>
            <Container fluid style={{ maxWidth: "1250px" }}>
                <Row className="justify-content-center mb-3">
                    <Col>
                        <FormControl type="text" value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} placeholder="Search" />
                    </Col>
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary">
                                {filters.typeOfJob === '' ? "Type of Job" : filters.typeOfJob}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {['Work from Home', 'Part-Time', 'Full-Time'].map(x => <Dropdown.Item key={x} onClick={() => setFilters({ ...filters, typeOfJob: x })}>{x}</Dropdown.Item>)}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <Row className="justfiy-content-center mb-3">
                            <Col>
                                <FormControl value={minSalary} onChange={e => setMinSalary(e.target.value)} type="text" placeholder="Min Salary" />
                            </Col>
                            <Col>
                                <FormControl value={maxSalary} onChange={e => setMaxSalary(e.target.value)} type="text" placeholder="Max Salary" />
                            </Col>
                        </Row>
                        <Row className="justify-content-center mb-3">
                            <Button variant="outline-success" onClick={() => setFilters({ ...filters, minSalary, maxSalary })}>Apply Salary</Button>
                        </Row>
                    </Col>
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" block style={{ maxWidth: "150px" }}>
                                {filters.duration === 0 ? "Duration" : filters.duration}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {[1, 2, 3, 4, 5, 6, 7].map(x => <Dropdown.Item key={x} onClick={() => setFilters({ ...filters, duration: x })}>{x}</Dropdown.Item>)}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" block style={{ maxWidth: "180px" }}>
                                {filters.order === '' ? "Order" : filters.order}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {["Salary Ascending", "Salary Descending", "Duration Ascending", "Duration Descending", "Rating Ascending", "Rating Descending"].map(x =>
                                    <Dropdown.Item key={x} onClick={() => setFilters({ ...filters, order: `${x}` })}>{x}</Dropdown.Item>)}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <Button variant="outline-warning" onClick={() => {
                            setFilters({
                                search:'',
                                typeOfJob: '',
                                maxSalary: '',
                                minSalary: '',
                                order: '',
                                duration: 0
                            }); setMinSalary(''); setMaxSalary(''); setVisibleJobs(jobs);
                        }}> Clear Filters</Button>
                    </Col>
                </Row>
                <Alert dismissible variant="success" show={alert} onClose={() => setAlert(false)}>Applied!</Alert>
                {!loaded ? <Row className="justify-content-center"><Loader /></Row> : (
                    <div>
                        {visibleJobs.map(job => <Job job={job} key={job._id} app_id={props.match.params.id} setAlert={setAlert} />)}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default Jobs
