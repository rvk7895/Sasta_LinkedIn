import React, { useState, useEffect, useContext } from 'react'
import { Row, Col, Button, Container } from 'react-bootstrap'
import axios from 'axios'
import Display from './display'
import Edit from './edit'
import CustomNav from '../navbar/navbar'
import Loader from '../loader/loader'
import { UserContext } from '../userContext/userContext'

const Profile = (props) => {

    const [edit, setEdit] = useState(false);
    const [user, setUser] = useState({});
    const [loaded, setLoaded] = useState(false);
    const { id } = useContext(UserContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/users/user/${props.match.params.id}`)
                setUser(res.data);
                setLoaded(true);
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [])


    const handleEdit = async () => {
        try {
            const res = await axios.post('/api/users/update', user);
            setEdit(false);
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <Container>
                <CustomNav />
                {id === props.match.params.id && 
                    < Row className="text-right">
                    <Col style={{ marginRight: '100px' }}>
                    {!edit ? (
                        <Button variant="outline-info" onClick={() => setEdit(true)}>Edit Profile</Button>
                    ) : (
                            <div>
                                <Button variant="outline-success" className="ml-3" onClick={handleEdit}>Save</Button>
                                <Button variant="outline-danger" className="ml-3" onClick={() => setEdit(false)}>Cancel</Button>
                            </div>
                        )}
                </Col>
                </Row>}

            {!loaded ? (<Row className="justify-content-center"><Loader /></Row>) : !edit ? <Display user={user} /> : <Edit user={user} setUser={setUser} />}
            </Container>
        </div >
    )
}

export default Profile

