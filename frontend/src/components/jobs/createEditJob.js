import React, { useEffect, useState } from 'react';
import { Modal, Col, Row, Form, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { v4 as uid } from 'uuid'
import axios from 'axios'
// import DateTimeField from 'react-bootstrap-datetimepicker';

const CreateEditJob = (props) => {

    const { show,
        setModal,
        recruiter_id,
        setJobs,
        jobs,
        setLoaded,
        func,
        job
    } = props;

    const [title, setTitle] = useState('');
    const [maxApp, setMaxApp] = useState(0);
    const [maxPos, setMaxPos] = useState(0);
    const [salary, setSalary] = useState(0);
    const [type, setType] = useState('');
    const [deadline, setDeadline] = useState();
    const [duration, setDuration] = useState(0);
    const [skills, setSkills] = useState([]);
    const [savedSkills, setSavedSkills] = useState([]);

    useEffect(() => {
        if (func === 'edit') {
            setTitle(job.title);
            setMaxApp(job.max_app);
            setMaxPos(job.max_pos);
            setSalary(job.salary);
            setType(job.type);
            setDeadline(`${job.deadline.getFullYear()}-${job.deadline.getMonth() + 1}-${job.deadline.getDate()}`);
            setDuration(job.duration);
            setSkills([...job.req_skills]);
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoaded(false);
        if (func === 'insert') {
            try {
                const res = await axios.post('/api/jobs/create', {
                    title,
                    max_app: maxApp,
                    max_pos: maxPos,
                    salary,
                    type,
                    deadline,
                    duration,
                    req_skills: skills,
                    recruiter_id
                });
                let newDeadline = new Date(deadline)
                console.log(res);
                setJobs(jobs.push({
                    title,
                    max_app: maxApp,
                    max_pos: maxPos,
                    salary,
                    type,
                    deadline: newDeadline,
                    duration,
                    req_skills: skills,
                    recruiter_id
                }));
                if (jobs) setLoaded(true)
            }
            catch (err) {
                console.log(err)
            }
        }

        if (func === 'edit') {
            try {
                const res = await axios.post('/api/jobs/edit', {
                    title,
                    max_app: maxApp,
                    max_pos: maxPos,
                    salary,
                    type,
                    deadline,
                    duration,
                    req_skills: skills,
                    recruiter_id
                })
                console.log(res);
            }
            catch (err) {
                console.log(err)
            }
        }
    }

    const skillCheck = () => {
        if (skills.length !== savedSkills.length) return true
        for (let i = 0; i < savedSkills.length; i++) {
            let flag = false;
            for (let j = 0; j < skills.length; j++) {
                if (skills[j].id === savedSkills[i].id && skills[j].name === savedSkills[i].name) flag = true
            }
            if (!flag) return true
        }

        return false;
    }

    return (
        <Modal centered size="lg" show={show} onHide={() => setModal(false)}>
            <Modal.Header closeButton>
                <h3>
                    Create Job
                </h3>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <Form.Group controlId='formTitle' className="justify-content-center mb-3">
                        <Row>
                            <Form.Label column sm={12} style={{ fontSize: '20px' }}>Title</Form.Label>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Form.Control type='text' value={title} placeholder="Name" onChange={e => setTitle(e.target.value)} />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Row>
                        <Col lg={6} sm={12}>
                            <Form.Group className="justify-content-center mb-3">
                                <Row>
                                    <Form.Label column sm={12} style={{ fontSize: '20px' }}>Max Applications</Form.Label>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <Form.Control type='number' value={maxApp} placeholder="Max Applications" onChange={e => setMaxApp(e.target.value)} />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col lg={6} sm={12}>
                            <Form.Group className="justify-content-center mb-3">
                                <Row>
                                    <Form.Label column sm={12} style={{ fontSize: '20px' }}>Max Positions</Form.Label>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <Form.Control type='number' value={maxPos} placeholder="Max Positions" onChange={e => setMaxPos(e.target.value)} />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6} sm={12}>
                            <Form.Group className="justify-content-center mb-3">
                                <Row>
                                    <Form.Label column sm={12} style={{ fontSize: '20px' }}>Salary</Form.Label>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <Form.Control type='number' value={salary} placeholder="Salary" onChange={e => setSalary(e.target.value)} />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col lg={6} sm={12}>
                            <Form.Group className="justify-content-center mb-3">
                                <Row>
                                    <Form.Label column sm={12} style={{ fontSize: '20px' }}>Type of Job</Form.Label>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <Form.Control as='select' value={type} placeholder="Type of Job" onChange={e => setType(e.target.value)} >
                                            <option />
                                            <option>Part-Time</option>
                                            <option>Full-Time</option>
                                            <option>Work from Home</option>
                                        </Form.Control>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6} sm={12}>
                            <Form.Group className="justify-content-center mb-3">
                                <Row>
                                    <Form.Label column sm={12} style={{ fontSize: '20px' }}>Deadline</Form.Label>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <Form.Control type='text' value={deadline} placeholder="YYYY-MM-DD" onChange={e => setDeadline(e.target.value)} />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col lg={6} sm={12}>
                            <Form.Group className="justify-content-center mb-3">
                                <Row>
                                    <Form.Label column sm={12} style={{ fontSize: '20px' }}>Duration</Form.Label>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <Form.Control as='select' value={duration} placeholder="Duration" onChange={e => setDuration(parseInt(e.target.value))} >
                                            <option>0</option>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                            <option>6</option>
                                        </Form.Control>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="justify-content-center mb-3">
                        <Row>
                            <Form.Label column sm={12} style={{ fontSize: '20px' }}>Skills Required</Form.Label>
                        </Row>
                        {skills.map(skill =>
                            <div key={uid()}>
                                <Row className="mb-3">
                                    <Col sm={9}>
                                        <Form.Control type='text' value={skill.name} onChange={e => {
                                            const name = e.target.value
                                            setSkills(currSkills => currSkills.map(currSkill => currSkill.id === skill.id ? {
                                                ...currSkill,
                                                name
                                            } : currSkill));
                                        }} placeholder="Skill name"></Form.Control>
                                    </Col>
                                    <Col sm={3}>
                                        <Button onClick={() => {
                                            setSkills(currSkills => currSkills.filter(x => x.id !== skill.id))
                                        }} variant='outline-danger' block>Delete</Button>
                                    </Col>
                                </Row>
                            </div>)}
                        {skillCheck() &&
                            <Row className="justify-content-center mb-3">
                                <Button variant="outline-success" onClick={() => setSavedSkills([...skills])}>Save</Button>
                            </Row>}
                        <Row className="justify-content-center mb-3">
                            <DropdownButton title="Choose">
                                <Dropdown.Item onClick={() => setSkills([...skills, { id: uid(), name: "Python" }])}>Python</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSkills([...skills, { id: uid(), name: "Java" }])}>Java</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSkills([...skills, { id: uid(), name: "C++" }])}>C++</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSkills([...skills, { id: uid(), name: "C#" }])}>C#</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSkills([...skills, { id: uid(), name: "Go" }])}>Go</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSkills([...skills, { id: uid(), name: "Julia" }])}>Julia</Dropdown.Item>
                            </DropdownButton>
                        </Row>
                        <Row className="justify-content-center mb-3" >
                            <Button onClick={() => setSkills([...skills, { id: uid(), name: "" }])} variant='outline-info' >Insert Skill</Button>
                        </Row>
                    </Form.Group>
                    <Button type='submit' variant="success" block>Create Job</Button>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default CreateEditJob
