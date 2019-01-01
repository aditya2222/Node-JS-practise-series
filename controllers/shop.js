const Product = require('../models/product');
const Order = require('../models/order')

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
		console.log(products)
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch((error) => {
            console.log(error)
        })
};


exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch((error) => {
            console.log(error)
        })
};

exports.getCart = (req, res, next) => {
	req.user
	.populate('cart.items.productId')
	.execPopulate()
	.then((user)=>{
		const products = user.cart.items
		res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        
		
	})
	.catch((error)=>{	
		console.log(error)	
	})

}

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId
	Product.findById(prodId)
	.then((product)=>{
		return req.user.addToCart(product)	
			.then((result)=>{
				console.log(result)	
				return res.redirect('/cart')
			})
			.catch((error)=>{
				console.log(error)	
			})
	})
	.catch((error)=>{
		console.log(error)	
	})
};

exports.postCartDelete = (req, res, next) => {
    const productId = req.body.productId;
	req.user.removeFromCart(productId)
	.then((result)=>{	
        	res.redirect('/cart');
	})
	.catch((err)=>{
		console.log(err)
	})
};

exports.getOrders = (req, res, next) => {
	Order.find({'user.userId': req.user._id}) 
		.then((orders)=>{	
		    res.render('shop/orders', {
			path: '/orders',
			pageTitle: 'Your Orders',
			orders: orders
		    });
		})
		.catch((error) => {
			console.log(error)	
		})
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

exports.postOrder = (req,res,next) => {

	req.user
	.populate('cart.items.productId')
	.execPopulate()
	.then((user)=>{
		console.log(user.cart.items)
		const products = user.cart.items.map(el=>{
			return {quantity: el.quantity, product: {...el.productId._doc} }
		})

		const order = new Order({
			user: {
				name: req.user.name,
				userId: req.user
			},
			products: products
			
		});
		return order.save()
	})
	.then((result)=>{
		return req.user.clearCart()
	})
	.then((response)=>{
	
		res.redirect('/orders')	
	
	})

	.catch(err=> console.log(err)) } 

exports.getProduct = (req, res, next) => { 
	const productId = req.params.productId; 
	Product.findById(productId)
        .then((product) => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch((error) => {
            console.log(error)
        })
};
