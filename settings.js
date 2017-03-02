// settings.js
// Uses commander.js to parse CLI arguments.

var program = require('commander');

const defaults = {
	count: 100,
	bound: [90, -180, -90, 180], // equivalent to "the whole earth!"
	geojson: false
}

var parseBBox = (i) => {
	i = i.split(',').map(parseFloat); // Turns "12,-83.1,-27,33.3" into [12, -83.1, -27, 33.3]
	if(i.length !== 4) return defaults.bound; // Invalid bbox
	return [i[0], i[1], i[2], i[3]];
}

program
	.version('0.0.1')
	.option('-c, --count <c>', 'The amount of points to create <int>', i => parseInt(i), defaults.count)
	.option('-b, --bound <b>', 'The bounding box, NW to SE <lat1,lng1,lat2,lng2>', parseBBox, defaults.bound)
	.option('-g, --geojson', 'Send data as geoJSON objects', defaults.geojson)
	.parse(process.argv);

// Perform a union of defaults and programs attributes
const p = Object.keys(defaults).reduce((o, k) => Object.assign(o, {[k]: program[k]}), {})
// Export a union of defaults and program arguments, program arguments taking priority
module.exports = Object.assign({}, defaults, p);