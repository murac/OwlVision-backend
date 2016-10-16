const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express()



app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({
    extended: true
}))

// Export the app instance for unit testing via supertest
module.exports = app
