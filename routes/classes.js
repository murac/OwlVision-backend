var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Course = require('../models/Course.js');
var CourseCtrl = require('../controllers/Course');

function retrieveList(req, res, next) {
    var query = {};
    CourseCtrl.retrieve(query,false).then(function (course) {
        // log.debug(event);
        res.json(course);
    }).catch(function (error) {
        throw error;
    })
}

router.get('/', retrieveList);

module.exports = router;