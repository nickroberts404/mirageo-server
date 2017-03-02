# mirageo-server
A server/interface for fake location data created by Mirageo.

#### Installing Globally
Installing mirageo-server globally will make it available throughout the terminal.
- `yarn global add mirageo-server`
- `npm install mirageo-server -g`

#### Install Locally
Sometimes it is important to install a package locally within a project so it can be explicitly declared a dependency.
- `yarn add mirageo-server --dev`
- `npm install mirageo-server --save-dev`

#### Arguments
- **-c --count &lt;int>**: The amount of points to create. *Defaults to 100*
- **-b --bound &lt;floats>**: The bounding box, NW to SE. *Defaults to [90, -180, -90, 180]*
- **-g --geojson**: Send data as geoJSON objects. *Defaults to false*
- **-p --port &lt;int>**: Which port the server will run on. *Defaults to 3030*

Example: 
`mirageo-server -c 400 -b 40,0,30,20 -p 8080 -g`

