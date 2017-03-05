# mirageo-server
A server/interface for fake location data created by Mirageo.

### Installing
- `yarn global add mirageo-server`
- `npm install mirageo-server -g`

### Arguments
- **-c --count &lt;int>**: The amount of points to create. *Defaults to 100*
- **-b --bound &lt;floats>**: The bounding box, WSEN. *Defaults to [-180, -90, 180, 90]*
- **-g --geojson**: Send data as geoJSON objects. *Defaults to false*
- **-p --port &lt;int>**: Which port the server will run on. *Defaults to 3030*
- **-m --map-key &lt;string>** Add Mapbox API key for the interface. *Defaults to nothing*

Example: 
`mirageo-server -c 400 -b 0,30,20,40 -p 8080`

This will serve data on `http://localhost:8080/data`. 
```js
fetch('http://localhost:8080/data')
  .then(res => res.json())
  .then(res => {
    res == { // example of data
      data: [{lat: -13.667, lng: 48.956}, ...],
      settings: {
        count: 400,
        bound: [40,0,30,20],
        geojson: false,
        ...
      }
    }
  })
```

### Interface
![Demo of mirageo-server interface](http://g.recordit.co/tUtfJRloAj.gif)
mirageo-server provides a map interface to visualize the data and change the settings.
To use it, you need to create an account with [Mapbox](https://www.mapbox.com), find your access token, and add it using: 
```
mirageo-server --map-key <Access Token>
```
The token will be stored locally using [lowdb](https://github.com/typicode/lowdb), so you will only need that command again to change it.

See the current key saved with `mirageo-server --map-key`.



### Future Plans
I'd like to add motion to the points, giving the tool more real-life applications.

