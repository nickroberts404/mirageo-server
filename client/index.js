import mapbox from 'mapbox-gl/dist/mapbox-gl.js';
import mapboxDraw from '@mapbox/mapbox-gl-draw';
import 'whatwg-fetch';
let map;
let mapLoaded = false;
const Draw = new mapboxDraw({
	displayControlsDefault: false,
	controls: {
		polygon: true,
		trash: true
	}
});

// First, request the Mapbox key so a map can be created. Then, request data from server for display.
fetch('http://localhost:3030/mapkey')
	.then(res => res.text())
	.then(createMap)
	.then(() => fetch('http://localhost:3030/data'))
	.then(res => res.json())
	.then(res => {
		updateControls(res.settings);
		if(mapLoaded) onMapLoad(res);
		else map.on('load', () => onMapLoad(res));
	})
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
	map.on('load', () => mapLoaded = true);
}

function onMapLoad(res) {
	addDrawControl();
	addDrawListeners();
	drawBounds(res.settings.bound);
	populateMap(res);
}

function drawBounds(bound) {
	if(Array.isArray(bound)) return console.error('Cant handle bounding box yet!');
	Draw.add(bound)
}

// Updates the setting's bound.
function updateBounds() {
	var bound = Draw.getAll().features[0] || null;
	updateSettings({bound});
}

// Adds the draw control to the map.
function addDrawControl() {
	map.addControl(Draw);
}

// Listen for changes to the bounds, and update them as they change. For now, we don't support multiple bounds,
// so only one polygon can exist. Creating a new one deletes the old one. I would like for this to change in the future. 
function addDrawListeners() {
	map.on('draw.create', () => {
		const allFeatures = Draw.getAll().features
		if(allFeatures.length > 1) Draw.delete(allFeatures[0].id);
		updateBounds();
	});
	map.on('draw.delete', updateBounds);
	map.on('draw.update', updateBounds);
}

// Make a post request to the server, updating the settings and receiving the resulting data. Populate map with the result.
function updateSettings(settings={}) {
	fetch('http://localhost:3030/data', {
		method: 'POST',
		headers: {
		'Content-Type': 'application/json'
		},
		body: JSON.stringify(settings)
	})
	.then(res => res.json())
	.then(populateMap)
	.catch(err => console.error(err));
}

// Puts the points on the map! First convert to a geoJSON feature collection, then remove any existing layers/source.
// Then add the new onen!
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

/**
DOM Operations
**/

// Get References to dom controls
const countInput = document.getElementById('count-input');
const refreshButton = document.getElementById('refresh-button');

// Add event listeners
// 'change' is called everytime the user unfocuses or presses enter. Perfect!
countInput.addEventListener('change', updateCount);
refreshButton.addEventListener('click', () => updateSettings());

// Takes count-input's value and updates settings with it. If it is empty, count will be 0
// If count is 0, put zero as count-input's value
function updateCount(e) {
	const count = parseInt(e.target.value) || 0;
	updateSettings({count})
	if(count === 0) updateControls({count})
}

// Mainly used to populate the controls with values from the settings, fresh from the server.
function updateControls(settings) {
	countInput.value = settings.count;
}
