// routes/index.js
var express = require('express');
var passport = require('passport');
var router = express.Router();


var development = process.env.NODE_ENV !== 'production';
var callbackURL = development ? 'http://localhost:3000/callback' : process.env.AUTH0_CALLBACK_URL;

var env = {
	AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
	AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
	AUTH0_CALLBACK_URL: callbackURL
};


router.get('/', (req, res) => {
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
		console.log(req.session.returnTo);
		res.redirect(req.session.returnTo || '/user');
	});

module.exports = router;