const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express()

var db = mongoose.connection;

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    var cursor = db.collection('quotes').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('index.ejs', {
            quotes: results
        })
    })
})
app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')
    })
})

// Export the app instance for unit testing via supertest
module.exports = app
