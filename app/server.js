#!/usr/bin/env node

var app = require('./index')
var config = require('./config')
const mongoose = require('mongoose');
const options = {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
};
mongoose.connect(config.mongodb.host, options);

// Use whichever logging system you prefer.
// Doesn't have to be bole, I just wanted something more or less realistic
var bole = require('bole')

bole.output({
    level: 'debug',
    stream: process.stdout
})
var log = bole('server')

log.info('server process starting')

// Note that there's not much logic in this file.
// The server should be mostly "glue" code to set things up and
// then start listening
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    app.listen(config.express.port, config.express.ip, (error) => {
        if (error) {
            log.error('Unable to listen for connections', error)
            process.exit(10)
        }
        log.info('express is listening on http://' +
            config.express.ip + ':' + config.express.port)
    })
});
