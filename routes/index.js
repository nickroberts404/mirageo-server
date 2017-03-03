// routes/index.js

const mirageo = require('mirageo');
const router = require('express').Router();
let settings = require('../settings');
const low = require('lowdb');
const db = low('db.json');
//Data initialization
let population = mirageo.conjure(settings);

// Routes
router.get('/', (req, res) => {
	res.send('index.html');
})

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

router.get('/mapkey', (req, res) => {
	const key = db.get('mapkey').value();
	res.send(key);
});

module.exports = router;