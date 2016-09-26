const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express()

var db = mongoose.connection;

app.set('view engine', 'ejs')

app.use(express.static('public'))

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

app.put('/quotes', (req, res) => {

//add mongoose code

    // db.collection('quotes')
    //     .findOneAndUpdate({
    //         name: 'Yoda'
    //     }, {
    //         $set: {
    //             name: req.body.name,
    //             quote: req.body.quote
    //         }
    //     }, {
    //         sort: {
    //             _id: -1
    //         },
    //         upsert: true
    //     }, (err, result) => {
    //         if (err) return res.send(err)
    //         res.send(result)
    //     })
})
app.delete('/quotes', (req, res) => {

  //add mongoose code

    // db.collection('quotes').findOneAndDelete({
    //         name: req.body.name
    //     },
    //     (err, result) => {
    //         if (err) return res.send(500, err)
    //         res.send('A darth vadar quote got deleted')
    //     })
})

// Export the app instance for unit testing via supertest
module.exports = app
