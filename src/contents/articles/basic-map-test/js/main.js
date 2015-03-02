var getJSON = require('get-json-data'),
  //reproject = require('reproject'),
  //proj4 = require('proj4'),
  reproject = require('reproject-spherical-mercator'),
  geojson2svg = require('geojson2svg'),
  parseSVG = require('parse-svg');

// get wountires geojson data
getJSON('./data/countries.geo.json',drawGeoJSON);

function drawGeoJSON(err,geojson) {
  if(err) {
    console.log(err);
    return;
  }
  // reproject geojson data from WGS84 to spherical mercator
  geojson.features = geojson.features.map( function(f) {
    return reproject(f);
  });

  // get the width and height of svgg element.
  // as the width of the map container is 100%, we have to set the width of the
  // svgElement as per the current width of the container.
  var container = document.getElementById('mapArea'),
    width = container.offsetWidth,
    svgMap = document.getElementById('map');
  svgMap.setAttribute('width', width);
  svgMap.setAttribute('height', width);
  // convert geojson to svg string 
  var convertor = geojson2svg(
    {width: width, height: width},
    { 
      attributes: {
        'style': 'stroke:#006600; fill: #F0F8FF;stroke-width:0.5px;',
        'vector-effect':'non-scaling-stroke'
      },
      explode: false
    }
  );
  var svgStrings = convertor.convert(geojson);
  
  // parse each svg string and append to svg element 
  svgStrings.forEach(function(svgStr) {
    var svg = parseSVG(svgStr);
    svgMap.appendChild(svg);
  });
}
