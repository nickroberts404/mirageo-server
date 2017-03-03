import mapbox from 'mapbox-gl/dist/mapbox-gl.js';
import 'whatwg-fetch';
let map;
fetch('http://localhost:3030/mapkey')
	.then(res => res.text())
	.then(createMap)
	.catch(err => console.error(err));

function createMap(key) {
	mapbox.accessToken = key;
	map = new mapbox.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v9'
	});
}