const express = require('express');
const User = require('../../models/users');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateRegistrationInput = require('../../validation/registration');
const validateLogin = require('../../validation/login');
const users = require('../../models/users');

router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegistrationInput(req.body);

    if (!isValid) res.send({ ...errors, status: 800 });
    else {
        User.findOne({ email: req.body.email }).then(user => {
            if (user) {
                res.send({ message: 'Email already exists!', status: 800 });
            }
            else {
                const newUser = req.body.role === 'applicant' ? new User({...req.body,
                    insti:[], skills:[],}) :
                    new User({...req.body, bio:"kuch nahi hai iske baare mein batane ke lie" , contact_no:""});

                bcrypt.hash(newUser.password, 10, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.send({ message: "Registered", status: 200 , user:user}))
                        .catch(err => console.log(err));
                });
            }
        });
    }
});

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLogin(req.body)

    if (!isValid) res.json({ ...errors, status: 800 })
    else {
        User.findOne({ email: req.body.email }).then(user => {
            if (!user) res.json({ message: "Email not found!", status: 800 })

            bcrypt.compare(req.body.password, user.password).then(isMatch => {
                if (isMatch) {
                    const payload = {
                        id: user.id,
                        name: user.name,
                        role: user.role
                    }

                    jwt.sign(
                        payload,
                        process.env.SECRET_OR_KEYS || 'secret',
                        {
                            expiresIn: 31556926 // 1 year in seconds
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: token,
                                status: 200
                            })
                        }
                    )
                }

                else res.json({ "message": "Password Incorrect", "status": 800 });
            })
        })
    }
})

router.get('/user/:userId', (req, res) => {
    User.findById(req.params.userId).then(user => {
        if (!user) res.send({ message: "User not found!", status: 801 });
        else res.status(200).send(user);
    });
});

router.post('/update', (req, res) => {
    User.findById(req.body._id).then(async (user) => {
        if (user.email === req.body.email) {
            await User.findByIdAndUpdate(req.body._id, req.body);
            res.status(200).send({ message: "Updated" });
        }
        else {
            User.findOne({ email: req.body.email }).then(async (user) => {
                if (user) res.send({ message: "Email used!", status: 800 });
                else await User.findByIdAndUpdate(req.body._id, req.body);
            });
        }
    });
});

router.post('/rating', (req, res) => {
    User.findById(req.body._id).then(async (user) => {
        flag = true;
        for (i = 0; i < user.rating.length; i++) {
            if (user.rating[i].userId === req.body.userId) {
                flag = false;
                user.rating[i].rating = req.body.rating;
                await User.findByIdAndUpdate(req.body._id, { rating: user.rating })
                res.send({ message: "rating updated" });
                break;
            }
        }
        if (flag) {
            user.rating.push({ userId: req.body.userId, rating: req.body.rating });
            await User.findByIdAndUpdate(req.body._id, { rating: user.rating });
            res.send({ message: "rating given" });
        }
    });
});

module.exports = router;