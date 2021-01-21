import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Jumbotron, Row, Card, Col, Badge, Button, Modal, FormControl, Alert, Dropdown } from 'react-bootstrap';
import CustomNav from '../navbar/navbar';
import Loader from '../loader/loader';
import { v4 as uid } from 'uuid';
import Fuse from 'fuse.js'
import CreateEditJob from './createEditJob'

const Job = (props) => {

    const { job, setAlert, setJobs, jobs } = props;
    const [loaded, setLoaded] = useState(true);
    const [modal, setModal] = useState(false);
    const [SOP, setSOP] = useState('');

    const handleDelete = async () => {
        try {
            const res = await axios.post('/api/jobs/delete', {
                id: job._id
            })
            console.log(res);
            setJobs(jobs.filter(currJob => currJob._id !== job._id));
        }
        catch (err) {
            console.log(err)
        }
    }

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
                            <Col lg={2} sm={6} xs={6}><span style={{ fontWeight: "bold" }}>Salary:</span>{` ${job.salary}`}</Col>
                            <Col lg={2} sm={6} xs={6}><span style={{ fontWeight: "bold" }}>Type:</span>{` ${job.type}`}</Col>
                            <Col lg={2} sm={6} xs={6}><span style={{ fontWeight: "bold" }}>Duration:</span>{job.duration === 0 ? " Indefinite" : ` ${job.duration} Months`}</Col>
                            <Col lg={2} sm={6} xs={6}><span style={{ fontWeight: "bold" }}>Deadline:</span>{` ${` ${job.deadline.getDate()}`}-${job.deadline.getMonth()+1}-${job.deadline.getFullYear()}`}</Col>
                            <Col lg={2} sm={6} xs={6}><span style={{ fontWeight: "bold" }}>Positions Left:</span>{` ${job.pos_left}`}</Col>
                            <Col lg={2} sm={6} xs={6}><span style={{ fontWeight: "bold" }}>Applications Left:</span>{` ${job.app_left}`}</Col>
                        </Row>
                        <Row style={{ margin: "0.1rem" }}>
                            <Col lg={6} sm={12} xs={12}>
                                <span style={{ fontWeight: "bold" }}>Required Skills:</span>{job.req_skills.map(skill => <Badge key={uid()} pill variant="info" style={{ margin: "0.1rem" }}>{skill.name}</Badge>)}
                            </Col>
                            <Col lg={4} sm={12} xs={12}>
                                <span style={{ fontWeight: "bold" }}>Rating: </span>TODO
                             </Col>
                            <Col lg={1} sm={12} xs={12}>
                                <Button variant="warning" block onClick={() => setModal(true)}>Edit</Button>
                            </Col>
                            <Col lg={1} sm={12} xs={12}>
                                <Button variant="danger" onClick={handleDelete}>Delete</Button>
                            </Col>
                        </Row>
                        <CreateEditJob show={modal} setModal={setModal} setJobs={setJobs} recruiter_id={job.recruiter_id} jobs={jobs} job={job} setLoaded={setLoaded} func={'edit'} />
                    </div>)}
            </Card>
        </div>
    )
}

const RecJobs = (props) => {

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
    const [modal, setModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/jobs/rec/${props.match.params.id}`);
                res.data = res.data.map(data => { const deadline = new Date(data.deadline); return { ...data, deadline } })
                console.log(res.data)
                setJobs([...res.data]);
                setVisibleJobs([...res.data]);
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
        setVisibleJobs(filtered);
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
                                search: '',
                                typeOfJob: '',
                                maxSalary: '',
                                minSalary: '',
                                order: '',
                                duration: 0
                            }); setMinSalary(''); setMaxSalary(''); setVisibleJobs(jobs);
                        }}> Clear Filters</Button>
                    </Col>
                </Row>
                <Alert dismissible variant="success" show={alert} onClose={() => setAlert(false)}>Created!</Alert>
                <Button variant="outline-success" className="mb-3" onClick={() => setModal(true)} block>
                    Create Job
                </Button>
                {!loaded ? <Row className="justify-content-center"><Loader /></Row> : (
                    <div>
                        {visibleJobs.map((job, idx) => <Job job={job} key={idx} setAlert={setAlert} setJobs={setJobs} jobs={jobs} />)}
                    </div>
                )}
                <CreateEditJob show={modal} setModal={setModal} recruiter_id={props.match.params.id} setJobs={setJobs} jobs={jobs} setLoaded={setLoaded} func={'insert'} job={{}} />
            </Container>
        </div>
    )
}

export default RecJobs
