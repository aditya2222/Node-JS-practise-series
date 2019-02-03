const bcrypt = require('bcryptjs')
const User = require('../models/user');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')
const {validationResult} = require('express-validator/check')
const transporter = nodemailer.createTransport(sendgridTransport({

    auth: {

        api_key: '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'

    }

}))

exports.getLogin = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {

        message = message[0]

    } else {

        message = null
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: {
            email: "",
            password: ""
        },
        validationErrors: []
    });
};


exports.getSignup = (req, res, next) => {
    let message = req.flash('error')
    if (message) {

        message = message[0]

    } else {

        message = null

    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        oldInput: {email:"", password:"", confirmPassword:""},
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log('Errors are',errors.array())
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }


    User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password')
                return res.redirect('/login')
            }
            bcrypt.compare(password, user.password)
                .then((response) => {
                    if (response) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            console.log('Saved')
                            res.redirect('/');
                        });
                    } else {
                        req.flash('error', 'Invalid email or password')
                        res.redirect('/login')
                    }
                })
                .catch((error) => {
                    res.redirect('/login')
                })

        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        console.log('sign up errors are', errors.array())
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: { email: email, password: password, confirmPassword: req.body.confirmPassword},
            validationErrors: errors.array()
        });
    }


    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const newuser = new User({
                email: email,
                password: hashedPassword,
                cart: {items: []}
            });
            return newuser.save()
        })
        .then(result => {
            transporter.sendMail({

                to: email,
                from: 'shop@node-complete.com',
                subject: 'Signup Succeeded',
                html: '<h1> successfully signed up </h1>'

            })
                .then((result) => {
                    res.redirect('/login')
                })
                .catch((error) => {

                    console.log(error)
                })
        })


        .catch((err) => {
            console.log(err)
        })


};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.getReset = (req, res, next) => {


    let message = req.flash('error')

    if (message) {

        message = message[0]

    } else {

        message = null
    }


    res.render('auth/reset', {

        path: 'reset',
        pageTitle: 'Reset Password',
        errorMessage: message


    })

}


exports.postReset = (req, res, next) => {


    crypto.randomBytes(32, (err, buffer) => {

        if (err) {

            console.log(err)
            return res.redirect('/reset')
        }

        const token = buffer.toString('hex')
        User.findOne({email: req.body.email})
            .then((user) => {

                if (!user) {

                    req.flash('error', 'No account with that email found')
                    return res.redirect('/reset')
                }

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000
                return user.save()

            })
            .then(result => {
                transporter.sendMail({

                    to: req.body.email,
                    from: 'shop@node-complete.com',
                    subject: 'Password Reset',
                    html: `
					<p> You requested for a password reset </p>
					<p> Please click this <a href="http://localhost:3000/new-password/${token}">Link</a> to reset your password </p>
					`

                })
                    .then(result => {
                        res.redirect('/')
                    })
                    .catch(err => {

                        console.log(err)
                    })
            })
            .catch((error) => {

                console.log(error)
            })

    })


}


exports.getNewPassword = (req, res, next) => {

    const token = req.params.token;
    console.log(token)
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {

            if (!user) {

                return res.redirect('/')

            }

            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            })
        })
        .catch(err => {

            console.log(err)
        })

    let message = req.flash('error')

    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }


}

exports.postNewPassword = (req, res, next) => {

    const newPassword = req.body.password;
    const userId = req.body.userId;
    const password = req.body.passwordToken
    let resetUser;

    User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
        .then((user) => {
            resetUser = user
            return bcrypt.hash(password, 12)

        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined
            return resetUser.save()
        })
        .then(result => {
            res.redirect('/login')
        })
        .catch((error) => {
            console.log(error)
        })


}
