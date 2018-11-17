const fs = require('fs')
const path = require('path')
module.exports = class Product {
    constructor(t) {
        this.title = t
    }

    save() {
        const myPath = path.join(__dirname, '../', 'data', 'products.json')
        fs.readFile(myPath, (err, data) => {
            let products = []
            if (!err) {
                products = JSON.parse(data)
            }
            products.push(this)
            fs.writeFile(myPath, JSON.stringify(products), (error) => {
                console.log(error)
            })
        })
    }

    static fetchAll() {
        const myPath = path.join(__dirname, '../', 'data', 'products.json')
        fs.readFile(myPath, (err, data) => {
            if (err) {
                return [];
            }
            return JSON.parse(data)
        })
    }


}