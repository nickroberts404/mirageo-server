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

function createMap(key) {
	mapbox.accessToken = key;
	map = new mapbox.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/light-v9',
		zoom: 3,
		center: [-98, 39]
	});
}

function populateMap({data, settings}) {
	console.log(settings)
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
