# Sasta_LinkedIn

A Job application portal built as an assginment for the course Design and Analysis of Software Systems. The App is built with MERN stack. It has two views :
* Recruiter : The user who creates the jobs and can view the applications posted for the job created.
* Applicant : The user who can apply to any active jobs available on the portal.

To run the app first you need to set up the environment variables 
``` 
export MONGO_URI = <MONGO DB CONNECTION STRING>
export PORT = <BACKEND'S PORT NUMBER>
``` 
To run the backend server head into the backend folder and run the following command
```
npm install
npm start
```
For the frontend in the `package.json` set the value of proxy as the address on which the backend is being run. Then to start the frontend server run the following command: 
```
npm install
npm start
```
