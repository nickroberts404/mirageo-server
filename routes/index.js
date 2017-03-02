// routes/index.js

const mirageo = require('mirageo');
const router = require('express').Router();
let settings = require('../settings');

//Data initialization
let population = mirageo.conjure(settings);

// Routes

router.get('/data', (req, res) => {
	res.send(population);
});

router.post('/data', (req, res) => {
	const newSettings = {
		count: req.body.count || settings.count,
		bound: req.body.bound || settings.bound,
		geojson: req.body.geojson || settings.geojson
	};
	population = mirageo.conjure(newSettings);
	res.send({data: population, settings: newSettings});
});

module.exports = router;