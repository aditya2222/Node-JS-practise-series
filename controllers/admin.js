const Product = require('../models/product');
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        editing: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    console.log(req.user)
    const product = new Product({	

	    title: title,
	    price: price,
	    description: description,
	    imageUrl: imageUrl,
	    userId: req.user

    
    })

    product.save()
	.then((result)=>{
		console.log('Product Created')	
		res.redirect('/admin/products')
	})
	.catch((error)=>{
		console.log(error)	
	})
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId;
       Product.findById(prodId)
        .then((product) => {
            if (!product) {
                res.redirect("/")
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch((error) => {
            console.log(error)
        })

};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;

    Product.findById(prodId)
	// Using mongoose if save is called on an existing product it will automatically not be saved as a new product but only as changes to the existing product
	.then((product)=>{	
		product.title = updatedTitle
		product.price = updatedPrice
		product,imageUrl = updatedImageUrl
		product.description = updatedDescription
	    	return product.save() 
	
	})

	.then((result) => {
	    console.log('Updated Product')
	    return res.redirect('/admin/products')
	})
	.catch((error) => {
	    console.log(error)
	})
	.catch((error)=>{
	
		console.log(error)	
	})


};



exports.getProducts = (req, res, next) => {
	Product.find()
//	.select('title price -_id')
//	.populate('userId')
        .then((products) => {
		console.log(products)
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch((error) => {
            console.log(error)
        })
};


//
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findOneAndDelete(prodId)
        .then(() => {
            console.log('Destroyed Product')
            return res.redirect('/admin/products')
        })
        .catch(error => console.log(error))

};
