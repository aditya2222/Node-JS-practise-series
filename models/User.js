const getDb = require('../util/database').getDb
const mongodb = require('mongodb')

class User {

	constructor(username, email, cart, id ){
		this.name = username
		this.email = email	
		this.cart = cart // { items:[] }
		this._id =id
	}

	save(){
		const db = getDb()
		return db.collection('users').insertOne(this)	
	}

	addToCart(product){
	
	//	const cartProduct = this.cart.items.findIndex(item => {
	//		return item._id === product._id	
	//	})
		const updatedCart = {items:[{productId: mongodb.ObjectId(product._id), quantity: 1}]}
		const db = getDb()
		return db.collection('users').updateOne({_id: mongodb.ObjectId(this._id)}, 
			{ $set: {cart: updatedCart} })


	
	
	}


	static 	findById(userId){
		const db = getDb()	
		return db.collection('users').findOne({_id:mongodb.ObjectId(userId)})
		.then((user)=>{
			console.log(user)	
			return user
		})
		.catch((error)=>{
			console.log(error)	
		})
	
	}


}

module.exports = User
