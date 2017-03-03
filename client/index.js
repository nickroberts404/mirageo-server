import mapbox from 'mapbox-gl/dist/mapbox-gl.js';
import 'whatwg-fetch';
let map;
fetch('http://localhost:3030/mapkey')
	.then(res => res.text())
	.then(createMap)
	.then(() => fetch('http://localhost:3030/data'))
	.then(res => res.json())
	.then(populateMap)
	.catch(err => console.error(err));

// fetch('http://localhost:3030/data')
// 	.then(res => res.json())
// 	.then(createMap)
// 	.catch(err => console.error(err));

function createMap(key) {
	console.log('key', key)
	mapbox.accessToken = key;
	map = new mapbox.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/outdoors-v9',
		zoom: 3,
		center: [-98, 39]
	});
	return;
}

function populateMap(d) {
	console.log(d)
}

