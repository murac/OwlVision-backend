// routes/index.js
var express = require('express');
var passport = require('passport');
var router = express.Router();
const cheerioReq = require("cheerio-req");

var env = {
	AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
	AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
	AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};


router.get('/', (req, res) => {
	cheerioReq("https://banner.fau.edu/FAUPdad/lwskdsch.p_dept_schd?pv_source=&pv_dept=ANTH&pv_term=201701&pv_campus=01&pv_college=&pv_level=&pv_crsno=6084&pv_section=001", (err, $) => {
		var crns = $("html u");
		var result = [];
		crns.each(function (i, el) {
			// this === el
			// console.log('%j',$(this).parent().parent().next().text());
			// console.log($(this).text());
			result.push({crn: $(this).text(), course: $(this).parent().parent().next().text()});
		}).get().join(', ');
		console.log(result);
		// console.log(crns[0].children[0].data.toString());
		// => Ionică Bizău
	});
	res.render('index', {
		property: 'Value 1',
		propertiesForPartial: ['One', 'Two'],
		title: 'It\'s working'
	});
});

// Render the login template
router.get('/login', (req, res) => {
	res.render('login', {
		env: env
	});
});

// Perform session logout and redirect to homepage
router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

// Perform the final stage of authentication and redirect to '/user'
router.get('/callback',
	passport.authenticate('auth0', {failureRedirect: '/error'}),
	function (req, res) {
		res.redirect(req.session.returnTo || '/user');
	});

module.exports = router;