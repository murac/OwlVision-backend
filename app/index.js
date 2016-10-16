const express = require('express');
const engine = require('ejs-mate');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');

// app.set('views', path.join(__dirname, '..', '/views'));
app.set('views',__dirname + '/../views');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}))


app.get('/', (req, res) => {
    res.render('index', {
        property: 'Value 1',
        propertiesForPartial: ['One', 'Two'],
        title: 'It\'s working'
    });
});

// Export the app instance for unit testing via supertest
module.exports = app;
