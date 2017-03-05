const path = require('path');
const webpack = require('webpack')
var fs = require('fs');

module.exports = {
	entry: [
		'whatwg-fetch',
		path.resolve(__dirname, 'client', 'index.js')
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public'),
        sourceMapFilename: 'bundle.map'
	},
	node: {
		fs: "empty"
	},
	module: {
		rules: [
			{test: /\.js$/, loader: 'babel-loader', include: [path.resolve(__dirname, 'client'), path.resolve(__dirname, 'node_modules/@mapbox/mapbox-gl-draw/src')]},
		]
	},
	devtool: 'cheap-module-source-map'
}