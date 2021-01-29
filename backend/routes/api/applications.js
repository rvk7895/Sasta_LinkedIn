const express = require('express');
const router = express.Router();
const Application = require('../../models/applications');
const Job = require('../../models/jobs');
const User = require('../../models/users')
require('dotenv').config();

router.get('/job/:jobId', async (req, res) => {
    const apps = await Application.find({ job_id: req.params.jobId });

    const applications = await Promise.all(
        apps.map(async (app) => {
            const user = await User.findById(app.app_id);
            return ({
                applicant: user._doc,
                application: app
            })
        })
    );

    return res.send(applications);
})

router.get('/app/:appId', async (req, res) => {
    Application.find({ app_id: req.params.appId }, (err, apps) => {
        if (err) res.status(400).send(err);
        res.status(200).send(apps);
    });
});

router.get('/rec/:recId', async (req, res) => {
    const apps = await Application.find({ rec_id: req.params.recId });
    const applications = await Promise.all(
        apps.map(async (app) => {
            const user = await User.findById(app.app_id);
            const job = await Job.findById(app.job_id);
            return ({
                applicant: user._doc,
                job: job._doc,
                application: app
            })
        })
    );

    return res.send(applications);
});

router.get('/employees/:recId', async (req, res) => {
    const apps = await Application.find({ rec_id: req.params.recId, status: "accepted" });
    const employees = await Promise.all(
        apps.map(async (app) => {
            const user = await User.findById(app.app_id);
            const job = await Job.findById(app.job_id);
            return ({
                applicant: user,
                job: job,
                application: app
            })
        })
    );

    return res.send(employees);
})

router.get('/jobs/:appId', async (req, res) => {
    const apps = await Application.find({ app_id: req.params.appId, status: "accepted" });
    const employees = await Promise.all(
        apps.map(async (app) => {
            const user = await User.findById(app.app_id);
            const job = await Job.findById(app.job_id);
            const recruiter = await User.findById(app.rec_id);
            return ({
                applicant: user,
                job: job,
                application: app,
                recruiter: recruiter
            })
        })
    );

    return res.send(employees);
})

router.post('/apply', (req, res) => {
    Application.findOne({ app_id: req.body.app_id, job_id: req.body.job_id }).then(apps => {
        if (apps) res.send({ message: "Already Applied!", status: 800 });
        else {
            req.body.applyingDate = new Date()
            const newApplication = new Application(req.body);
            newApplication.save();
            Job.findById(req.body.job_id).then(async (job) => {
                job.app_left = job.app_left - 1;
                await Job.findByIdAndUpdate(req.body.job_id, { app_left: job.app_left });
            })
            res.status(200).send(newApplication);
        }
    });
});

router.post('/accept', async (req, res) => {
    await Application.updateMany({ app_id: req.body.app_id }, { status: "rejected" });
    const dateOfJoining = Date();
    await Application.updateMany({ job_id: req.body.job_id, app_id: req.body.app_id }, { status: "accepted", dateOfJoining });
    Job.findById(req.body.job_id).then(async (job) => {
        job.pos_left = job.pos_left - 1;
        await Job.findByIdAndUpdate(req.body.job_id, { pos_left: job.pos_left });
        if (job.pos_left == 0) {
            await Application.updateMany({ job_id: req.body.job_id, status: "pending" }, { status: "rejected" });
            await Application.updateMany({ job_id: req.body.job_id, status: "shortlisted" }, { status: "rejected" });
        }
    })
    res.status(200).send({ message: "Application accepted" });
});

router.post('/reject', async (req, res) => {
    await Application.updateOne({ app_id: req.body.app_id, job_id: req.body.job_id }, { status: "rejected" });
    res.send({ message: "Application rejected" });
});

router.post('/shortlist', async (req, res) => {
    await Application.updateOne({ app_id: req.body.app_id, job_id: req.body.job_id }, { status: "shortlisted" });
    res.send({ message: "Application shortlisted" });
});

module.exports = router;