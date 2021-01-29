const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
require('dotenv').config();

const users = require('./routes/api/users');
const jobs = require('./routes/api/jobs');
const applications = require('./routes/api/applications');

const app = express();

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(bodyParser.json({limit:'50mb'}));

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true }); //connects to the mongoDB

app.use(passport.initialize());
require('./config/Passport')(passport);

app.use('/api/users', users);
app.use('/api/jobs', jobs);
app.use('/api/applications', applications);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));