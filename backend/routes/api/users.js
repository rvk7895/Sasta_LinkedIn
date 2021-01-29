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
                    insti:[], skills:[],profile_picture:'data:image/jpeg;base64,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',
                CV:''}) :
                    new User({...req.body, bio:"kuch nahi hai iske baare mein batane ke lie" , contact_no:"", profile_picture:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIHERUSBxEWFRAVFh0aFxgXGBsYFhgbFx0aGB8YHSEaHiggIBolHRcdITMjJSsrLjEwFx8zODMuOCktLisBCgoKDg0OGxAQGi4lHyUvLS81LisvLS0tLS01LS0tNS0tNS0yLystLS0tLS0tLS0wLSsuLTUrNy0tLSstMi0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABQYCBAcDAQj/xABHEAACAQMDAgMDBwkECAcAAAABAgMABBEFEiETMQYiQTJRYQcUI1JxgZEVM0JicoKhsdEkkpPSFzVEU2ODouElQ0VUssHC/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAECAwQF/8QAJREBAQACAQQCAQUBAAAAAAAAAAECEQMSITFBUWETFCIycZEE/9oADAMBAAIRAxEAPwDuNKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKjPEGtR6FF1LkFizbY0XG+RyCQoyQOwJJJAAUkkAVUL573X4973SxK2CscDP08cHzSxskjn4oUXnkGqZ8mOHlbHG5eFwv8AXrbT22XU6iQDPTXzy4+CJlz9wqGk8YPcZGj2Ur/rTFYEz3wQ2ZRx/wAP1FVU2iaewGoRm3yeJ7Z3SJmP+9X9FiSeZN6k4y2SBWd7YmzJbUUaaMjDXEWYrpAO3U6O0ug5OU5GfZ9a57/0X00nFPaQ1LWL2MA39w8Yb/2dqZdnwLOshJ57hB9grUd474bG1Cd5yPKklzJbsT6ZSLpsBn3LXtDDcRqJNIuUuImGVWY5yCONksY7ftK/21hdarBKpTxDAYh69eMPCR7+oA0ePgSD8BWV5M77/wAadGM9NARrbkLqsWoRtnG6O6vLiI/EGOQsB+0q17PYi5G7w7dSORkOvz65ye3G7qsEYYPDIfure/JjR4k0K4KA87WJmgYcdgWyvA42MBz2Nas0kM7hfEdukM58qyg+Vs4/NzgKysfqna2RxnGaj8mXq06Z8NOwm1CNtun6jcB1HmtroQmXA7ssnTYOvPdePQsD2nNM8b3EDBNZgDOTjaoEM2e/kR3aOYAZJMcmePZzxUdqNubJQNWDT2qklZhkXNvkY3EphioBI6i4YD2gwyw95rKbZtBivLdsEJNgPjOQQ4BR8cEZUHj2vWrzmyntW8cX/TdRi1ROpYuGXOD3DKfVWU4KsM8qwBHqK2q49pOsPo0zGBZOtGMmN+ZJ4QAzQMQSHuYk80b5JZcDJ8+OuWtwt2iyWzBo3UMrDkFWGQR8CDXXhl1Rjljp60pSrqlKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKUoFKVhNIIVLSnCqCST2AHJNBzfxlrbW2olZeiyQwKVSR3RgJWKvMMRspXshJxtCsSQCa8Pm0W8HptY3MjeWSMoY5WwOMrmN854EgDHBK9s1IaRoy69A1zraHr3T9YEErJAuNsSIwwVKx9/eXfOcmou98OXmkLt09I7yzbiW3fCMV45RT9GG7nC7F/VzzXNyce7uN8bqJNdS6P0WvIsZbyh/agkzxjJ9lj9R8d8AtWAtJ9H/1UOrb9+gzYkT4ROxwV90b4AzwwAAqJ0SX5y3SF47W8hMca3ESvsdR5rWUMFffjkFm8wBGeMt6a54budPtpvm91ElqsLM0YEkYTYCweJg7NHjAOzJXy4wMmsZw1frbtvbR3ReTw9MYZQ30kZU9PdzxJC2CpOc7l2k8HJHfZXV2tR/4zA8WMAuv0sJz6hlG5V+LqoqHsfCclzDC+p3k3zoICWQpld2G6YZkMm1e2d3OMmpTTPCdtYxhDGC+STIv0Ttkk89MjOAQM98KM5qlmPuplvwxjsYrgGfw3MkbHJ3RkPA57+dFO0/tLtb4+lZm/lxs1K0DKQQxidJIyPirlX59wVqxl8I2kwxOsrpuDFXnmdGK4I3qzkN2HtZrYHhmwP8AsFr/AIEX+Wo/b8p7oiW7h0ggabdRxAqGFtcHZGASQMEjfFkjHOV4OFrwh1IWG4WMqwhDloJh1IUyMjbLESI0buA2QB2QdqtVhpdvpu78nW0MW4Ybpxqm4DsDtAyK+2NhDp5drCGOJnxvMaKhbGcZ2jnue/vNTvFGqpetXsN+I7m3dUn2jdGHUy/RNuWWPB+kMZLYC8OkjjuQKuvyW3zXVpJFMmxred4yuchchZdoP1B1Cq+u1VB5zWD6ZbsWZreIswwx6aZYd8E45GfQ1G4TwxdQ3Ngqx28rJb3CKoVMOSIpcAYBV2C590nwrbh5JLpnyY3W3RqUpXYwKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKpvj67bUCml2OepdKWmYEDp2yMokPv3Pnpj9onIxVyrlOs+JX0691N0jHzhEiEYY5Bihw0pOOxCz9UD1DDvggRUxZPnV/cDNrawQr6CaZi4+BWJCox8HNFfUo/aSzk+ySaLP/RJj+NRV/wCMJUkEFtbBZz+i79ZwPrdO1DsV57sUHxFJNdv9NG7UIkkTIziCaHGe53K0wGP1to95FZ7jV66jpMurSB5LVYZxtJkEivG4RgyhsAMWRsOpK8FSMgMczerQrq9rPHAQ4kjkj4ORkhkK5B7hsg+4g1r+H/Eltr4PzCQdRQC0ZKllz6+UlWX9ZSR6ZzkVh4Yj6DXaIMKt45X49RIpmx8N8jD7jUjX0G7GoWsMq588a5B7hgMMp+IYEH7KkScVD6bt066vYCwEYK3KjsEWYEP8MdSJ2/frSttdn12bo6FDsi6YkNzN22MSqskXDHdsbaW2jy55GM8V4r1WRpM5rusmM0wagtWtLnw4vzpbuW4gTm4jlEeRH+lLGY0Ugp7W3kEAjvip9W+PBqufHcPKZlt834r6DWFZLzVFn1fN3rW1CyTUIpIboZjkQo32MMfj617bqzXnvUyljZ8E6m+oWoXUDm6gYwzn3ugHn+x1Kv8Av1P1TfAUwNxqSAcrdI2f24IR/wDj+NXKvUxu5K47NUpSlSgpSlApSlApSlApSlApSlApSlApSlApSlApSlApSlAqj65axa5qsYEaH5lHumk2jczzKypATjO0IzSMvbzR8c1cb+7SwieW5OI40Z2PuVQWJ/AVRIbO5j06Qwri/u/PIeMxyXBCk8ntChAx7ohUVbGd0Hr1vbz6NJd6dax25Tc0DR/RssbSheqCgBBaMB9vP6I5qteGtQg6sR1O7lDHqApbXc0zE7coVAdiWyuNpGDu5HpXZorSOGNYo0HSVQqqQCAFwAMfDArKK3SHmFFU/AAfyqsyWuO1Ki0W41CNZprWH50GYLK7G1uzGMbWdrdWCyHnK8qRjIGSot+lq6xILzPUAw25lYkjjcSiqpzjPAHfsK2q1dS1GLSo+rqMgjiBALN7IJ4GT6c8c1C2tKv4lYpqCJCkTPcWciDqg7X6UiM0Rx2DI7DPOM5wcYMVYazChaw1q3ecEJ0UKbp327iLeYMQpZNrbXZtjqCckgk/df1FNQkS+uUSXT4lnhQKcl1lxG0zHO0RMydMe4SBmIBO3PVLiWOO2W8jkKrdWzRy9iymVV2yg+ZJQGwcjBx3ycDLq1n2Trs2y6QeWKC4t4ZSkM1vMoMZW4boLJGQzorB2UFVbsTlc4IkPCiMtlbi4OXSIIxznJj8hP8A01u+JgZTAhH0ImWaZzwiJbfTZJ95dUAH2nsDWv4cJ+aQl1Kll3YIwwDkuAfccMOKrz/xTh5b45rLGK+UzXI1fcV6Y9K8wcdq09b1L8lxbol3zOwjhj9ZJX9lfgOMk+gUmrYzd1EW6fPk/Xdd6o68qbmNc/rJCm4fcTV2qI8K6INAtlhLb5SS80mMdSWQ7nfHpljwPQYFS9enjNTTkt3SlKVKClKUClKUClKUClKUClKUClKUClKUClKUClKUClKUFU+UWQdGCK6O23muo0nYnCiMbpNrHsFdo1jOePpMetb89wluu64dUX3sQo5+J4qZmhW4UpOoZGGCrAEEH0IPBFcMgubSCVxdROto8zGMxTSpBGsc1xD1FRGwEHSi3N6G4JOFIFUzuptfB02+muHHU0UwSIFztYsC59wkUlV496msbPX7e5ihleRYxPF1UWRlVtuFJ9ceXcM499UL8mxR3TR2ZkWYneIzL0EuoiPajmgCuWGezlh5cY53Df1t3uGs4oY1tBC4WNZhG8asNoV0JYLIojDgBWWQd8e6kzl8L919trlLsbrV1dc4yjBhkemR61Rtfujq0rTqHa2s5E+jBOJArMZZdoOHClVKggn6FiPaBqO/KEyJJLo7brkJ1AQ+5XScqI4XP/MLxljlQq/ok5lYUPh6R4NOiDL82R4kzgv0mZZlGe74dGyTyZBn1NZZ59tTymRmNMeCR5rCKCW3flY8jzLKAZDGWG1C2ASuSjnk7DknQ8S2o07d0YnAIV4NssjRtLbkTiFoydqM3SwpUcjI4OAZCXSngUJpPUFtIQyhG2SWzkhg6hyAYuSWiPbGApB2g0Y1gOdQcoI1Md1ESdoKedJoznKMDh1cdwRnlRtxl1dr2MbjVW8UvbmFGTSpDnc4KvcOqmQR7e4hBU5J9spgZXk2faWPIqs+D7aC/iuLK9aG7gVxLGcKytHOWYZC+UMJFk7Y9OB2qSPgHTD/ALGv96T/ADVvnx9ertTHLSQWdCdu9d3u3DPx4rVutWt7RgtxOgc52oGDSNjvtRcs33A1nD4P06AYjsLbHxiRj+LAmpOysIbAYsYo4x7kRU/+IFV/BPlbrqvS+J4I8LGk7StxHGbeaNpW+opkRVz6nngAk8Cp3QPDzRuLrXCHu8HaoJMNuGGCsYPBbHBkI3HJ7L5a19Cj+e6lcyzc/No44Yh9UyjqyMP2sxj/AJdWyt+Pixx7xjnlaUpStVClKUClKUClKUClKUClKUClKUClKUClKUClKUClKUClKUCqB4z8Hx2qS32kyGGWMmZlYqYTweoyiRWWOVgSdwxk9+5q/wBUL5WdRJtms7YZaSMvJ6YRSAiA/XllKoPhvI5FRda7pn0oN9q6aTaxxS2sdxGXDossL28rMxHsrsMZl5zlCDn9Hmt1rua7iMOj2M6Boupt68Ttl/Y3LcFl2ZQqwxlSDxk1M6dZwW8yyWccUOy7kh3RxjdOBGy7XbJORLliSe8Q9a8rVfyYjm0AM8N5MqDaN0qSH5y0Ck9mKvxyMvGvvrjyyxt7R0Vilvca0wj1EfNZFjEkcaTmXeU8quQFWHCSbGI83IXsDztWQbUbeGRZcXL/ANptwxJZcovUhbPdMyMnwDjHKg1hBLLayMujuHjKG5gjJG2VHP0kQJ5Uq+1lI4HX2kYAx96XStEutPbfFDJ84gwDuMEgzJEQO5CvJtHvVPUVSjdurqW3do5y4FxGzQ7dheOVEy0ClhsYkDcu7PsyZOMVrysZVhusTCRkw0toFdWjUll3o4JIbOcKrMpZhu7k7f5Oe/iljuJCVMnUtpgQWXOJUP7j5A9CoAOcmvC3sZ2RpNPDW1zli0TbXtpJCM7hjJCM3O5NjcksM5FV7JbnhuRLq9uZbMqY2t7fBX1O+5Jz8ecc88YParRVU8EBbiW9niRULzrGwUg+aGNN2ccbg7uM+u0Va668ZrGKFKUqyEJ4OVoNQ1NJceZoJVPqVeIx/wADERVyqpq403UY5CPJdR9Bj7pIt8sefgVaYZ94UetWytJ4ZXyUpSpQUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgVy7VoJbnVJuiu9Y5onkdj7KqkWyFfTyiSaQrjuyHOTXUa5TfW0moTXUmhziO6eWVJEdm2lAxtllwDxInR8pHcAg98jLmv7V8PLK61CMx2txBEyWoHznACqZJJlbpwqM8ys8pY49QMnzVnaWWYoEvmDrPJN1wpDKJZC8uQwGQ0bRlFYEY+0DGjoWmR2t1DmeW4iZZmgMuAI5YSkRAChQTs3YyOAh245r208/PbFhaH+2Rf2jb2VZmLSbV/wCCzh19eGYZ445L9Nnt4QkKzTwTDDR7WwQOJCzpIy44CuFjlIHrMT64rPTTBAHFzN5IGllVg3ka3nLMc4yGRWLL7wYh6HnTud0F7HdacAevEJFXIBm8qiWJSTt6hRIJFB79B+wyR81y9toFiMELgySPtEWUvElc5YrE48yEglx7Jxkhgaa3f7PCe0qxaKzW2vGI2xmIOr4YouUSQMMEMUCtx2JqEvZjd7oxatdahGu0rFIVhOB5XkO9UQNnPTbLcngjmtuLw02vQQi7S1jtwmI16SXEqoQMbXYmJGwBwquB2BOAatWi6RBocKwaXGI4l9B6n1YnuWOO5rTDi91Fy+Gt4S0f8gWUFtxujQb9vYufMxH2sTUvSvC9vI7BDJfSLHGO7OwVR95rdV71r319Fp677+VI0H6TsFH4k1zDxT8q5y0fhdBjt15BwfiiHv8Aa34GuZ395LqT9TUpHlk+s5LEZ9BnhR8BgVaYq3J2zxT4v0+8tnW0voeuoEkOGziWI74+RwMsoH2E1OR/KhpJRXkvFBYAldkjMpIzghVJyO1fm8SAnANHkCe0f61aTSlu3620jVYdaiWfS5BJE3Zhn04IIPIIPoea3K/NPgv5QrnwpBLDYwowkfehkJwhICt5V5IOAcZHIPvrqvyefKXH4lIt9VVYbzHlwfo5vfszyGGMlDk+oJ5xKHQaUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQK514z05/D876hp4JjdW3jDFUcqo3OFBPRYopLKMowzyHbHRaVGWMymqmXTmnhjUIhCjRuGgnmY2zdz9JulMb4GFdW6icn9EDucVjp1mumTyL1tshjkI3R4UoZZJkYMThun1WVhnPIPGebdqfgyw1Qsbq3GXILbHePcwxhiI2ALDA8x54FI/BtipBktxJgYAmd5l49cSsw3cd8Zrn/AE/20/L9KxpcN/rUcLWES28PZnfG1l9kyRx7dw7ZTcR7Q3KRXjpJXSLK9NuBLewPPG7kh5ZXBYxBmHJyrxjHYHIwMVs/LF4wfw7AkGkyBbqc9x7UcQ9px7iThQT8cdq4/wCE/Fk/hVpmsURzMF3GTccFS53cEZJ385NazjmM7K9dt7u+6Bp50q1gt3O5ooUQkdiUUKSPhkV6anqkGkpv1OZIk97sFz9me5+Argeo/KNqN8SDdlB22wIq/wAcFh/eqtTTyXLb5wzv9aR9zficmp6Trdc8RfK2keU8ORGQ9urKCsf2qvtN9+3765jrOsT6w/V1mZpGHbccKv7Kjyr9wqP2s3tMAPgOfxP9KwUoPY8xH7x/HsKtJpW21n1C/wCaH3ngf1NOju/Okn4dh+A/+6bmbsoH2n+n9adIt+cYn7OB/DmpQ9OE+AryWRE9j+Az/KsjGq8sB9p/71J6bod1qgB0y0nlQ9mSJyh/ext/jQRfUJ9hT9+B/wB/4UG8kEHaQcgrncCOQQeMEH1q42fya6tdsB8z6YP6UkkYUfbtZm/AGrjpPyIlhnW70/swIBj9+TOf7ooK9ovyt6jpgC3pjuUH+8GyT++nH4qT8a6z4E8cw+M0Y2sUkbpjcGGUOfquvlb+B+FNH+TnTNJGI7RJGznfOOs+R7t+QP3QKtEUSwqFhUKoGAAMAD3ACgzpSlApSlApSlApSlApSlApSlApSlApSlApSlApSlApSlApSlB+WvHGqnW9RuZn7dVo0+CREoPQd8Fv3qr/AEAfzhLfaePw7VfLv5LdVadxHboUMjESdVBHgktnGd4HPbbn+dZ/6I9V+rb/AOMf8lBRAMdq+1ev9Eeq/Vt/8Y/5K2Lb5G9SlP08ltGMd97ufswEH86DnHR3fnTu/l+H9a9OF+ArsVj8iC/+pXzH4RRBP4uW/kKtmh/Jhpmj4bodeQfpznqc+8KfID9iig4Ho2gXeu/6mtZZV+soxHx+uxCfxq+6H8i91c4bW7iOFfVI/pJPsycKD9zV3CNBGAIwAo4AAwAPcKyoKloPyb6bomGitxLKP/MmPVbI9QG8qn9kCrYo28L2r7SgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSg/9k='});

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