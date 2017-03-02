const path = require('path');

module.exports = {
	entry: path.resolve(__dirname, 'client', 'index.js'),
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public'),
        sourceMapFilename: 'bundle.map'
	},
	module: {
		rules: [
			{test: /\.js$/, loader: 'babel-loader', include: path.resolve(__dirname, 'client')},
		]
	},
	devtool: 'cheap-module-source-map'

}