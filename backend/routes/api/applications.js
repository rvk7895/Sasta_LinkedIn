const express = require('express');
const router = express.Router();
const Application = require('../../models/applications');
const Job = require('../../models/jobs');
require('dotenv').config();

router.get('/job/:jobId', (req, res) => {
    Application.find({ job_id: req.params.jobId }, (err, apps) => {
        if (err) res.status(400).send(err);
        res.status(200).send(apps);
    });
});

router.get('/app/:appId', async (req, res) => {
    Application.find({ app_id: req.params.appId }, (err, apps) => {
        if (err) res.status(400).send(err);
        res.status(200).send(apps);
    });
});

router.get('/rec/:recId', async (req, res) => {
    Application.find({ rec_id: req.params.recId }, (err, apps) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(apps);
    });
});

router.get('/employees/:recId', async (req, res) => {
    Application.find({ rec_id: req.params.recId, status: "accepted" }, (err, apps) => {
        if (err) return res.send({ error: err, status: 800 });
        return res.send(apps);
    })
})

router.get('/jobs/:appId', async (req, res) => {
    Application.find({ app_id: req.params.appId, status: "accepted" }, (err, apps) => {
        if (err) return res.send({ error: err, status: 800 });
        return res.send(apps);
    })
})

router.post('/apply', (req, res) => {
    Application.findOne({ app_id: req.body.app_id, job_id: req.body.job_id }).then(apps => {
        if (apps) res.send({ message: "Already Applied!", status: 800 });
        else {
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
    await Application.updateMany({ job_id: req.body.job_id, app_id: req.body.app_id }, { status: "accepted" });
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