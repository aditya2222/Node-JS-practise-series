const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient


let _db;

const mongoConnect = (callback) => {

MongoClient.connect('mongodb+srv://admin:tiktik123@cluster0-5t9yf.mongodb.net/test?retryWrites=true',{useNewUrlParser:true})
.then((client)=>{
console.log('Connected')
_db = client.db()
callback()
})
.catch((err)=>{
console.log(err)
throw err
})


}

const getDb = () =>{

if(_db){

return _db

}

throw 'No Database Found'

}



exports.mongoConnect = mongoConnect
exports.getDb = getDb
