// routes/index.js

const mirageo = require('mirageo');
const router = require('express').Router();

//Data initialization
var population = mirageo.conjure();

// Routes

router.get('/data', (req, res) => {
	res.send(population)
});

router.get('/settings', (req, res) => {
	// res.send(settings);
});

router.post('/settings', (req, res) => {
	
})

module.exports = router;