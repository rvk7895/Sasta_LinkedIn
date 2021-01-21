const express = require('express');
const router = express.Router();
require('dotenv').config();
const Jobs = require('../../models/jobs');
const Applications = require('../../models/applications')

router.get('/all', (req, res) => {
    Jobs.find({}, (err, jobs) => {
        res.status(200).send(jobs);
    });
});

router.get('/job/:jobId', (req, res) => {
    Jobs.findById(req.params.jobId, (err, job) => {
        if(err) res.send({error: err, status:800});
        res.status(200).send(job);
    });
});

router.post('/create', (req, res) => {
    req.body.deadline = new Date(req.body.deadline);
    req.body.post_date = new Date();
    req.body.app_left = req.body.max_app;
    req.body.pos_left = req.body.max_pos;
    console.log(req.body);
    const newJob = new Jobs(req.body);
    newJob.save();
    res.status(200).send(newJob);
});

router.get('/rec/:recId', (req, res) => {
    Jobs.find({ recruiter_id: req.params.recId }, (err, jobs) => {
        res.status(200).send(jobs);
    });
});

router.post('/delete', async (req, res) => {
    Jobs.findByIdAndDelete(req.body.id, (err) => {
        if (err) res.status(400).send(err);
        res.status(200).send({ message: "Deletion successful" });
    });

    await Applications.updateMany({ job_id: req.body.id }, { status: 'deleted' });
});

router.post('/rating', (req, res) => {
    Jobs.findById(req.body._id).then(async (job) => {
        flag = true;
        for (i = 0; i < job.rating.length; i++) {
            console.log('here');
            if (job.rating[i].userId === req.body.userId) {
                flag = false;
                console.log('here');
                job.rating[i].rating = req.body.rating;
                await Jobs.findByIdAndUpdate(req.body._id, { rating: job.rating })
                res.send({ message: "rating updated" });
                break;
            }
        }
        if (flag) {
            job.rating.push({ userId: req.body.userId, rating: req.body.rating });
            await Jobs.findByIdAndUpdate(req.body._id, { rating: job.rating });
            res.send({ message: "rating given" });
        }
    })
        .catch(err => console.log(err));
});

router.post('/edit', async (req, res) => {
    console.log(req.body);
    await Jobs.findByIdAndUpdate(req.body._id, req.body);
    res.send({ message: "Job Updated" });
})

module.exports = router;