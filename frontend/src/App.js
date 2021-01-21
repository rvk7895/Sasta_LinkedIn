import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import landing from './components/landing/landing'
import signIn from './components/singIn/singIn'
import SignUp from './components/signUp/SignUp'
import Profile from './components/profile/profile'
import Application from './components/application/application'
import RecApplication from './components/application/recApplication'
import Jobs from './components/jobs/jobs'
import RecJobs from './components/jobs/recJobs'

import { BrowserRouter, Route } from "react-router-dom"
import { UserContext } from './components/userContext/userContext'

const App = () => {

  const [id, setId] = useState();
  const [role, setRole] = useState();

  useEffect(() => {
    if(!role) setRole(localStorage.getItem('LinkedInRole'));
    if(!id) setId(localStorage.getItem('LinkedInid'));
  }, [role,id]);

  return (
    <UserContext.Provider value={{ id, setId, setRole }}>
      <BrowserRouter>
        <Route exact path='/' component={landing} />
        <Route path='/signIn' component={signIn} />
        <Route path='/signUp' component={SignUp} />
        <Route path='/profile/:id' component={Profile} />
        <Route path='/jobs/:id' component={role==='applicant' ? Jobs : RecJobs} />
        <Route path='/applications/:id' component={role === 'applicant' ? Application : RecApplication} />
      </BrowserRouter>
    </UserContext.Provider>
  )
  // }
}

export default App;