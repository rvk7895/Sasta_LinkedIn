import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Image, Form, InputGroup, FormControl, Button, DropdownButton, Dropdown } from 'react-bootstrap'
import { v4 as uid } from 'uuid'

const Recruiter = (props) => {

    const {
        user, setUser
    } = props

    return (
        <div>
            <Form.Group controlId='formContact' className="justify-content-center mb-3">
                <Row>
                    <Form.Label column sm={12} style={{ fontSize: '20px' }}>Contact No.</Form.Label>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Form.Control type='text' value={user.contact_no} placeholder="Contact No." onChange={e => setUser({ ...user, contact_no: e.target.value })} />
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group controlId='formBio' className="justify-content-center mb-3">
                <Row>
                    <Form.Label column sm={12} style={{ fontSize: '20px' }}>Bio</Form.Label>
                </Row>
                <Row>
                    <Col sm={12}>
                            <Form.Control as="textarea" rows={3} value={user.bio} placeholder="Bio" onChange={e => setUser({ ...user, bio: e.target.value })} />
                    </Col>
                </Row>
            </Form.Group>
        </div>
    )
}

const Applicant = (props) => {

    const { user,
        setUser
    } = props;

    const [insti, setInsti] = useState(user.insti)
    const [skills, setSkills] = useState(user.skills)

    const skillCheck = () => {
        if (skills.length !== user.skills.length) return true
        for (let i = 0; i < user.skills.length; i++) {
            let flag = false;
            for (let j = 0; j < skills.length; j++) {
                if (skills[j].id === user.skills[i].id && skills[j].name === user.skills[i].name && skills[j].starty === user.skills[i].starty && skills[j].endy === user.skills[i].endy) flag = true
            }
            if (!flag) return true
        }

        return false;
    }

    const lengthCheck = () => {
        if (insti.length !== user.insti.length) return true
        for (let i = 0; i < user.insti.length; i++) {
            let flag = false;
            for (let j = 0; j < insti.length; j++) {
                if (insti[j].id === user.insti[i].id && insti[j].name === user.insti[i].name && insti[j].starty === user.insti[i].starty && insti[j].endy === user.insti[i].endy) flag = true
            }
            if (!flag) return true
        }

        return false;
    }

    return (
        <div>
            <Row>
                <Col sm={12} lg={6}>
                    <Row className="justify-content-center text-center" style={{ fontSize: "2rem" }}>
                        Educational Institutes
                </Row>
                    {insti.map(ins => <div key={uid()}>
                        <Row className="mb-3">
                            <Col sm={9}>
                                <Form.Control type='text' value={ins.name} onChange={e => {
                                    const name = e.target.value
                                    setInsti(currInsti => currInsti.map(insti => insti.id === ins.id ? {
                                        ...insti,
                                        name
                                    } : insti));
                                }} placeholder="Name of Institution"></Form.Control>
                            </Col>
                            <Col sm={3}>
                                <Button onClick={() => {
                                    setInsti(currInsti => currInsti.filter(x => x.id !== ins.id))
                                }} variant='outline-danger' block>Delete</Button>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Form.Control type='text' value={ins.starty} onChange={e => {
                                    const starty = e.target.value
                                    setInsti(currInsti => currInsti.map(insti => insti.id === ins.id ? {
                                        ...insti,
                                        starty
                                    } : insti));
                                }} placeholder="Starting year"></Form.Control>
                            </Col>
                            <Col>
                                <InputGroup className="mb-3">
                                    <FormControl type='text' value={ins.endy} onChange={e => {
                                        const endy = e.target.value
                                        setInsti(currInsti => currInsti.map(insti => insti.id === ins.id ? {
                                            ...insti,
                                            endy
                                        } : insti));
                                    }} placeholder="Ending Year">
                                    </FormControl>
                                    <InputGroup.Append>
                                        <Button variant="outline-secondary" onClick={() => {
                                            const endy = "Present";
                                            setInsti(currInsti => currInsti.map(insti => insti.id === ins.id ? {
                                                ...insti,
                                                endy
                                            } : insti));
                                        }} >Present</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Col>
                        </Row>
                    </div>)}
                    {lengthCheck() &&
                        <Row className="justify-content-center mb-3">
                            <Button variant="outline-success" onClick={() => { setUser({ ...user, insti }); console.log(user) }}>Save</Button>
                        </Row>}
                    <Row className="justify-content-center mb-3" >
                        <Button onClick={() => setInsti([...insti, { id: uid(), name: "", starty: "", endy: "" }])} variant='outline-info' >Insert Institution</Button>
                    </Row>
                </Col>
                <Col sm={12} lg={6}>
                    <Row className="justify-content-center text-center" style={{ fontSize: "2rem" }}>
                        Skills
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
                            <Button variant="outline-success" onClick={() => { setUser({ ...user, skills }) }}>Save</Button>
                        </Row>}
                        <Row className="justify-content-center mb-3">
                            <DropdownButton title="Choose">
                                <Dropdown.Item onClick={() => setSkills([...skills, {id:uid(), name:"Python"}])}>Python</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSkills([...skills, {id:uid(), name:"Java"}])}>Java</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSkills([...skills, {id:uid(), name:"C++"}])}>C++</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSkills([...skills, {id:uid(), name:"C#"}])}>C#</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSkills([...skills, {id:uid(), name:"Go"}])}>Go</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSkills([...skills, {id:uid(), name:"Julia"}])}>Julia</Dropdown.Item>
                            </DropdownButton>
                        </Row>
                    <Row className="justify-content-center mb-3" >
                        <Button onClick={() => setSkills([...skills, { id: uid(), name: "" }])} variant='outline-info' >Insert Skill</Button>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

const Edit = (props) => {

    const {
        user,
        setUser
    } = props

    return (
        <div>
            <div style={{ margin: "20px" }} />
            <Container>
                <Row className="justify-content-center">
                    <Image src={process.env.PUBLIC_URL + '/images/avatar.png'} roundedCircle style={{ height: '300px', width: '300px', borderStyle: "solid", borderWidth: "5px" }} />
                </Row>
                <div style={{ margin: "40px" }} />
                <Form.Group controlId='formName' className="justify-content-center mb-3">
                    <Row>
                        <Form.Label column sm={12} style={{ fontSize: '20px' }}>Name</Form.Label>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <Form.Control type='text' value={user.name} placeholder="Name" onChange={e => setUser({ ...user, name: e.target.value })} />
                        </Col>
                    </Row>
                </Form.Group>
                <Row className="justify-content-center mb-3" style={{ fontSize: "2rem" }}>
                    <Col sm={6} className="text-right"> Email :</Col>
                    <Col sm={6} >{user.email}</Col>
                </Row>
                <Row className="justify-content-center mb-3" style={{ fontSize: "2rem" }}>
                    <Col sm={6} className="text-right"> Role :</Col>
                    <Col sm={6} >{user.role}</Col>
                </Row>
                {user.role === 'recruiter' ? <Recruiter user={user} setUser={setUser} /> : <Applicant user={user} setUser={setUser} />}
            </Container>
        </div>
    )
}

export default Edit
