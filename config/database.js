const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

exports.connect = () => {
    mongoose.Promise = global.Promise
    mongoose
        .connect(String(process.env.MONGO_URL), {
            auth: { authSource: 'admin' },
            user: process.env.MONGO_USER,
            pass: process.env.MONGO_PASS,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('backend connect to database')
        })
        .catch((err) => {
            console.log("error : " + err)
        })
}
