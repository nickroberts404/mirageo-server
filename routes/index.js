// routes/index.js

const mirageo = require('mirageo');
const router = require('express').Router();
const low = require('lowdb');
const db = low('db.json');

//Data initialization
let settings = require('../settings');
let population = mirageo.conjure(settings);

// Routes
router.get('/', (req, res) => {
	res.send('index.html');
})

router.get('/data', (req, res) => {
	res.send({data: population, settings});
});

router.post('/data', (req, res) => {
	settings = {
		count: req.body.count === undefined ? settings.count : req.body.count || 0,
		bound: req.body.bound  === undefined ? settings.bound : req.body.bound || [90, -180, -90, 180],
		geojson: req.body.geojson === undefined ? settings.geojson : req.body.geojson || false
	};
	population = mirageo.conjure(settings);
	res.send({data: population, settings});
});

router.get('/mapkey', (req, res) => {
	const key = db.get('mapkey').value();
	res.send(key);
});

module.exports = router;