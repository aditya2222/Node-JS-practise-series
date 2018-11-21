const fs = require('fs')
const path = require('path')

const myPath = path.join(__dirname, '../', 'data', 'products.json')

const getProductsFromFile = (callback) => {
    fs.readFile(myPath, (err, data) => {
        if (err) {
            return callback([]);
        } else {
            return callback(JSON.parse(data));
        }
    })
}
module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price

    }

    save() {
        getProductsFromFile((products) => {
            products.push(this)
            fs.writeFile(myPath, JSON.stringify(products), (error) => {
                console.log(error)
            })
        })
    }

    static fetchAll(callback) {
        getProductsFromFile(callback)
    }


}