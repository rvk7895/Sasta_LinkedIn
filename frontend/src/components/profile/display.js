import React, { useEffect, useContext } from 'react'
import { Container, Row, Image, Col, Card, Badge } from 'react-bootstrap'
import { UserContext } from '../userContext/userContext'
import {v4 as uid} from 'uuid'

const Recruiter = (props) => {
    const user = props.user;

    return (
        <div>
            <Row className="justify-content-center mb-3" style={{ fontSize: "2rem" }}>
                <Col sm={6} className="text-right"> Contact No. :</Col>
                <Col sm={6} >{user.contact_no}</Col>
            </Row>
            <Row className="justify-content-center mb-3" style={{ fontSize: "2rem" }}>
                <Col sm={6} className="text-right">Bio :</Col>
                <Col sm={6} />
            </Row>
            <Row className="text-center justify-content-center" style={{ fontSize: "1.25rem" }}>
                {user.hasOwnProperty('bio') ? user.bio : 'kuch bhi nahi hai iske baare mein'}
            </Row>
        </div>
    )
}

const Applicant = (props) => {
    const { user } = props;

    useEffect(() => {
        // console.log(user)
    }, [user])

    return (
        <div>
            <Row>
                <Col sm={12} lg={6}>
                    <Row className="justify-content-center text-center" style={{ fontSize: "2rem" }}>
                        Educational Institutes
                </Row>
                    {user.insti.length ? (
                        <div>
                            {user.insti.map(ins =>
                                <div key={uid()}>
                                    <Card className="mb-3">
                                        <Card.Body>
                                            <Row className="mb-1">
                                                <Col sm={12}>
                                                    <h2>{ins.name}</h2>
                                                </Col>
                                            </Row>
                                            <Row className="mb-1">
                                                <Col sm={12} className="text-left">
                                                    {ins.starty} - {ins.endy}
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )}
                        </div>
                    ) : (
                            <div className="text-center">
                                Padhai vadhai karo yeh kya kar rahe ho
                            </div>
                        )}
                </Col>
                <Col sm={12} lg={6}>
                    <Row className="justify-content-center text-center" style={{ fontSize: "2rem" }}>
                        Skills
                </Row>
                    {user.skills.length ? (
                        <div>
                            {user.skills.map(skill => <Badge key={uid()} pill variant="info" style={{ margin: "5px", fontSize: "30px" }}>{skill.name}</Badge>)}
                        </div>
                    ) :
                        (
                            <div className="text-center">
                                Kuch nahi ata isko
                            </div>
                        )}
                </Col>
            </Row>
        </div>
    )
}

const Display = (props) => {

    const { user } = props;
    const { id } = useContext(UserContext);
    // const [userRating, setUserRating] = useState(0);
    // let finalRating = 0.0;

    // const calcRating = () => {
    //     const { rating } = user;
    //     let total = 0;
    //     rating.forEach(rating => total + rating.rating);
    //     finalRating = total / rating.lenght;
    // }

    // useEffect(() => {
    //     console.log(props)
    //     console.log(id)
    // }, [user])

    return (
        <div>
            <div style={{ margin: "20px" }} />
            <Container>
                <Row className="justify-content-center">
                    <Image src={process.env.PUBLIC_URL + '/images/avatar.png'} roundedCircle style={{ height: '300px', width: '300px', borderStyle: "solid", borderWidth: "5px" }} />
                </Row>
                <div style={{ margin: "40px" }} />
                {/* <Row className="justify-content-center mb-3">
                    <Col>Rating: {finalRating}</Col>
                    {id !== user._id &&
                        <Col>
                            <Dropdown variant='secondary' title="Give Rating">
                                <Dropdown.Item onClick={()=>setUserRating(1)}>1</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setUserRating(2)}>2</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setUserRating(3)}>3</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setUserRating(4)}>4</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setUserRating(5)}>5</Dropdown.Item>
                            </Dropdown>
                        </Col>}
                </Row> */}
                <Row className="justify-content-center mb-3" style={{ fontSize: "2rem" }}>
                    <Col sm={6} className="text-right"> Name :</Col>
                    <Col sm={6} >{user.name}</Col>
                </Row>
                <Row className="justify-content-center mb-3" style={{ fontSize: "2rem" }}>
                    <Col sm={6} className="text-right"> Email :</Col>
                    <Col sm={6} >{user.email}</Col>
                </Row>
                <Row className="justify-content-center mb-3" style={{ fontSize: "2rem" }}>
                    <Col sm={6} className="text-right"> Role :</Col>
                    <Col sm={6} >{user.role}</Col>
                </Row>
                {user.role === 'recruiter' ? <Recruiter user={user} /> : <Applicant user={user} />}
            </Container>
        </div>
    )
}

export default Display
