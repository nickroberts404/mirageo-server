import mapbox from 'mapbox-gl/dist/mapbox-gl.js';
import mapboxDraw from '@mapbox/mapbox-gl-draw';
import 'whatwg-fetch';
let map;
let Draw = new mapboxDraw();

// First, request the Mapbox key so a map can be created. Then, request data from server for display.
fetch('http://localhost:3030/mapkey')
	.then(res => res.text())
	.then(createMap)
	.then(() => fetch('http://localhost:3030/data'))
	.then(res => res.json())
	.then(populateMap)
	.catch(err => console.error(err));

// Updates the access token and creates a new map centered above North America.
// The map is rendered into a div#map.
function createMap(key) {
	mapbox.accessToken = key;
	map = new mapbox.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/light-v9',
		zoom: 3,
		center: [-98, 39]
	});
	addDrawControl();
}

function addDrawControl() {
	map.addControl(Draw);
}

function populateMap({data, settings}) {
	if(!data) return false;
	const feature = pointsToFeature(data, settings.geojson);
	// Remove old layers
	if(map.getSource('points')) map.removeSource('points');
	if(map.getLayer('points')) map.removeLayer('points');

	const circleRadius = {stops: [[8, 3], [11, 7], [16, 15]]};
	map.addSource('points', {
		type: 'geojson',
		data: feature,
	});
	map.addLayer({
		id: 'points',
		type: 'circle',
		source: 'points',
		paint: {
			'circle-radius': circleRadius,
			'circle-color': '#8e44ad',
			'circle-opacity': 0.7,
			'circle-stroke-width': 2,
			'circle-stroke-color': 'white',
		}
	})
}

// Accepts an array of points and a boolean reperesenting whether the array is one of geoJSON points.
// If the points are already geoJSON, just put them in a FeatureCollection.
// Otherwise, we need to turn them into geoJSON as well.
function pointsToFeature(points, isGeoJSON) {
	let collection = {
		type: 'FeatureCollection',
	}
	if(isGeoJSON) collection.features = points;
	else collection.features = points.map(i => ({
		type: "Feature",
		geometry: {
			type: "Point",
			coordinates: [i.lng, i.lat],
		}
	}))
	return collection;
}
