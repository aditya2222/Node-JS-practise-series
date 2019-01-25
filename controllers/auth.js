const bcrypt = require('bcryptjs')
const User = require('../models/user');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({

	auth: {

		api_key:'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'
	
	}

}))

exports.getLogin = (req, res, next) => {
	let  message = req.flash('error')
	if(message.length>0){
	
		message = message[0]
	
	}
	else{
	
		message = null
	}
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		errorMessage: message
	});
};

exports.getSignup = (req, res, next) => {
	let message = req.flash('error')
	if(message){

		message = message[0]
	
	}

	else{
	
		message = null
	
	}
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		errorMessage: message
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email
	const password = req.body.password
	User.findOne({email:email})
		.then(user => {
			if(!user) {
				req.flash('error','Invalid email or password')
				return res.redirect('/login')
			}
			bcrypt.compare(password, user.password)
				.then((response)=>{
					if(response){
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save(err => {
							console.log(err);
							console.log('Saved')
							res.redirect('/');
						});
					}
					else{
						req.flash('error','Invalid email or password')
						res.redirect('/login')
					}
				})
				.catch((error)=>{
					res.redirect('/login')
				})

		})
		.catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	User.findOne({email: email})
		.then((user) => {
			if (user) {
				req.flash('error','Email already exists')
				return res.redirect('/signup')
			}
			return bcrypt.hash(password, 12)
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
					.then((result)=>{
						res.redirect('/login')
					})
					.catch((error)=>{
					
						console.log(error)
					})
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
