const User = require('../models/user')

exports.getLogin = (req,res,next)=>{

	const isLoggedIn = 
		console.log(req.session.isLoggedIn)
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
			res.redirect('/')
		})
		.catch((error)=>{
			console.log(error)	
		})

}
