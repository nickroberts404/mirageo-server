// routes/index.js

const mirageo = require('mirageo');
const router = require('express').Router();
var settings = require('../settings');

//Data initialization
var population = mirageo.conjure(settings);

// Routes

router.get('/data', (req, res) => {
	res.send(population);
});

router.get('/settings', (req, res) => {
	// res.send(settings);
});

module.exports = router;