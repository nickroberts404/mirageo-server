// settings.js
// Uses commander.js to parse CLI arguments.

var program = require('commander');
const low = require('lowdb');
const db = low(__dirname + '/db.json');

db.defaults({ mapkey: '' })
	.write()

const defaults = {
	count: 100,
	bound: [-180, -90, 180, 90], // equivalent to "the whole earth!"
	geojson: false,
}

const parseBBox = (i) => {
	i = i.split(',').map(parseFloat); // Turns "12,-83.1,-27,33.3" into [12, -83.1, -27, 33.3]
	if(i.length !== 4) return defaults.bound; // Invalid bbox
	return [i[0], i[1], i[2], i[3]];
}

const addMapKey = (key) => {
	db.set('mapkey', key).write();
	console.log(`Map key has been changed to ${key}`)
	return key;
}

program
	.version('0.0.1')
	.option('-c, --count <c>', 'The amount of points to create <int>', i => parseInt(i), defaults.count)
	.option('-b, --bound <b>', 'The bounding box, <W,S,E,N>', parseBBox, defaults.bound)
	.option('-g, --geojson', 'Send data as geoJSON objects', defaults.geojson)
	.option('-p, --port <p>', 'Which port the server will run on, defaults to 3030')
	.option('-m, --map-key [m]', 'Add Mapbox API key for the interface', addMapKey)
	.parse(process.argv);

// MapKey flag was used, but no arg. Just display the current MapKey.
if(program.mapKey === true) {
	const key = db.get('mapkey').value();
	console.log(`Current map key set to ${key}`);
} 
// // Perform a union of defaults and programs attributes
// const p = Object.keys(defaults).reduce((o, k) => Object.assign(o, {[k]: program[k]}), {})
// Export a union of defaults and program arguments, program arguments taking priority
module.exports = Object.assign({}, defaults, program);