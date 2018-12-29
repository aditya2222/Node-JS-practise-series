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
	
	const cartProductIndex = this.cart.items.findIndex(item => {
		return item.productId.toString() === product._id.toString()
	})
		let newQuantity = 1;
		const updatedCartItems = [...this.cart.items]
		if(cartProductIndex>=0){
			newQuantity = this.cart.items[cartProductIndex].quantity + 1
			updatedCartItems[cartProductIndex].quantity = newQuantity
		
		}
		else{
		
			updatedCartItems.push({productId: mongodb.ObjectId(product._id), quantity: newQuantity})	
		}
		const updatedCart = {items:updatedCartItems}
		const db = getDb()
		return db.collection('users').updateOne({_id: mongodb.ObjectId(this._id)}, 
			{ $set: {cart: updatedCart} })
	
	
	}

	getCart(){
		const db = getDb()	
		const prodIds = this.cart.items.map((element)=>{
			return element.productId
		})
		return db.collection('products').find({_id:{$in: prodIds}}).toArray()
			.then((products)=>{
				return products.map((element)=>{
					return {...element, quantity:this.cart.items.find(i=>{
						return	i.productId.toString() === element._id.toString()
					}).quantity }
				})		
			})
			.catch((error)=>{
				console.log(error)	
			})
	
	}

	deleteItemFromCart(productId){
	
		const updatedCartItems = this.cart.items.filter(i => {
			
			return i.productId.toString() !==  productId.toString()
		})	

		const db = getDb()
		return db.collection('users').updateOne({_id: mongodb.ObjectId(this._id)}, {$set: {cart:{items: updatedCartItems}}})
	
	}


	addOrder(){
		
		const db = getDb()
		return db.collection('orders').insertOne(this.cart)
			.then((response)=>{	
				this.cart = {items:[]}
				db.collection('users').updateOne({_id: this._id}, {$set:{cart:{items:[]}}})
			
			})
			.catch((error)=>{
			
				console.log(error)	
			})
	
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
