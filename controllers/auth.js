const User = require('../models/user')

exports.getLogin = (req,res,next)=>{

	const isLoggedIn = 
		//console.log(req.session.isLoggedIn)
	res.render('auth/login',{	
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: req.session.isLoggedIn
	})


}


exports.postLogin = (req,res,next) =>{	
	User.findById('5c28d7d6d1236114e2980b45')
		.then((user)=>{
			req.session.user = user
			req.session.isLoggedIn = true
			req.session.save((error)=>{
				console.log(error)	
				res.redirect('/')
			})
		})
		.catch((error)=>{
			console.log(error)	
		})

}


exports.postLogout = (req, res, next) => {

	req.session.destroy((error)=>{
			
		console.log(error)
		res.redirect('/')
	})


}
