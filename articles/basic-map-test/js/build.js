(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/js/main.js":[function(require,module,exports){
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

},{"geojson2svg":"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/geojson2svg/src/main.js","get-json-data":"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/get-json-data/index.js","parse-svg":"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/parse-svg/index.js","reproject-spherical-mercator":"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/reproject-spherical-mercator/index.js"}],"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/geojson2svg/node_modules/multigeojson/index.js":[function(require,module,exports){
//index.js 
(function() { 
	var singles = ['Point', 'LineString', 'Polygon'];
	var multies = ['MultiPoint', 'MultiLineString', 'MultiPolygon'];
	function explode(g) {
	  if( multies.indexOf(g.type) > -1) {
	    return g.coordinates.map(function(part) {
	      var single = {};
	      single.type = g.type.replace('Multi','');
	      single.coordinates = part;
        if(g.crs) single.crs = g.crs;
	      return single;
	    });  
	  } else {
	    return false;
	  }
	}
	function implode(gs) {
	  var sameType = gs.every(function(g) { 
	    return singles.indexOf(g.type) > -1;
	  })
    var crs = gs[0].crs || 0;
    var sameCrs = gs.every(function(g) {
      var gcrs = g.crs || 0;
      return gcrs == crs;
    });
	  if(sameType && sameCrs) {
	    var multi = {};
	    multi.type = 'Multi' + gs[0].type;
	    multi.coordinates = [];
      if(crs != 0) multi.crs = crs;
	    gs.forEach(function(g) {
	      multi.coordinates.push(g.coordinates);
	    });
	    return multi;
	  } else {
	    return false;
	  }
	};
	var multigeojson = {
	  explode: explode,
	  implode: implode
	};
	if(typeof module !== 'undefined' && module.exports) {
	  module.exports = multigeojson;
	} else if(window) {
	  window.multigeojson = multigeojson;
	}
})();

},{}],"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/geojson2svg/node_modules/xtend/immutable.js":[function(require,module,exports){
module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/geojson2svg/src/converter.js":[function(require,module,exports){
//converter.js
var multi = require('multigeojson');
function getCoordString(coords,res,origin) {
  //origin - svg image origin 
  var coordStr = coords.map(function(coord) {
    return (coord[0] - origin.x)/res + ',' + (origin.y - coord[1])/res;
  });
  return coordStr.join(' ');
}
function addAttributes(ele,attributes) {
  var part = ele.split('/>')[0];
  for(var key in attributes) {
    if(attributes[key]) {
      part += ' ' + key + '="' + attributes[key] + '"';
    }
  }
  return part + ' />';
}

function point(geom,res,origin,opt) {
  var r = opt && opt.r ? opt.r : 1;
  var path = 'M' + getCoordString([geom.coordinates],res,origin)
    +' m'+ -r+ ',0'+ ' a'+r+','+ r + ' 0 1,1 '+ 2*r + ','+0
    +' a'+r+','+ r + ' 0 1,1 '+ -2*r + ','+0;
  return [path];
}
function multiPoint(geom,res,origin,opt) {
  var explode = opt && opt.hasOwnProperty('explode') ? opt.explode : false;
  var paths = multi.explode(geom).map(function(single) {
    return point(single,res,origin,opt)[0];
  });
  if(!explode) return [paths.join(' ')];
  return paths;

}
function lineString(geom,res,origin,otp) {
  var coords = getCoordString(geom.coordinates,res,origin);
  var path = 'M'+ coords;  
  return [path];
}
function multiLineString(geom,res,origin,opt) {
  var explode = opt && opt.hasOwnProperty('explode') ? opt.explode : false;
  var paths = multi.explode(geom).map(function(single) {
    return lineString(single,res,origin,opt)[0];
  });
  if(!explode) return [paths.join(' ')];
  return paths;
}
function polygon(geom,res,origin,opt) {
  var mainStr,holes,holeStr;
  mainStr = getCoordString(geom.coordinates[0],res,origin);
  if (geom.coordinates.length > 1) {
    holes = geom.coordinates.slice(1,geom.coordinates.length);
  }
  var path = 'M'+ mainStr;
  if(holes) {
    for(var i=0;i<holes.length; i++) {
      path += ' M' +  getCoordString(holes[i],res,origin);
    }
  }
  path += 'Z';
  return [path];
}
function multiPolygon(geom,res,origin,opt) {
  var explode = opt.hasOwnProperty('explode') ? opt.explode : false;
  var paths = multi.explode(geom).map(function(single) {
    return polygon(single,res,origin,opt)[0];
  });
  if(!explode) return [paths.join(' ').replace(/Z/g,'') + 'Z'];
  return paths;
}
module.exports = {
  Point: point,
  MultiPoint: multiPoint,
  LineString: lineString,
  MultiLineString: multiLineString,
  Polygon: polygon,
  MultiPolygon: multiPolygon
};

},{"multigeojson":"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/geojson2svg/node_modules/multigeojson/index.js"}],"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/geojson2svg/src/instance.js":[function(require,module,exports){
var extend = require('xtend'),
	converter = require('./converter.js');

//g2svg as geojson2svg (shorthand)
var g2svg = function(viewportSize,options) {
  if(!viewportSize) return;
  this.viewportSize = viewportSize;
  this.options = options || {};
  this.mapExtent = this.options.mapExtent ||
    {
      left: -20037508.342789244,
      right: 20037508.342789244,
      bottom: -20037508.342789244,
      top: 20037508.342789244
    };
  this.res = this.calResolution(this.mapExtent,this.viewportSize,
    this.options.fitTo);
};
g2svg.prototype.calResolution = function(extent,size,fitTo) {
  var xres = (extent.right - extent.left)/size.width;
  var yres = (extent.top - extent.bottom)/size.height;
  if (fitTo) { 
    if (fitTo.toLowerCase() === 'width') {
      return xres;
    } else if (fitTo.toLowerCase() === 'height') {
      return yres;
    } else {
      throw new Error('"fitTo" option should be "width" or "height" ');
    }
  } else {
    return Math.max(xres,yres);
  }
};
g2svg.prototype.convert = function(geojson,options)  {
  var opt = extend(extend({},this.options), options || {});
  var multiGeometries = ['MultiPoint','MultiLineString','MultiPolygon'];
  var geometries = ['Point', 'LineString', 'Polygon'];
  var svgElements = [];
  if (geojson.type == 'FeatureCollection') {
    for(var i=0; i< geojson.features.length; i++) {
      svgElements = svgElements.concat(
        this.convertFeature(geojson.features[i],opt));
    }
  } else if (geojson.type == 'Feature') {
    svgElements = this.convertFeature(geojson,opt);
  } else if (geojson.type == 'GeomtryCollection') {
    for(var i=0; i< geojson.geometries.length; i++) {
      svgElements = svgElements.concat(
        this.convertGeometry(geojson.geometries[i],opt));
    }
  } else if (converter[geojson.type]) {
    svgElements = this.convertGeometry(geojson,opt);
  } else {
    return;
  }
  if(opt.callback) opt.callback.call(this,svgElements);
  return svgElements;
};
g2svg.prototype.convertFeature = function(feature,options) {
  if(!feature && !feature.geometry) return;
  var opt = extend(extend({},this.options), options || {});
  opt.attributes = opt.attributes || {};
  opt.attributes.id = opt.attributes.id || feature.id || null;
  return this.convertGeometry(feature.geometry,opt);
};
g2svg.prototype.convertGeometry = function(geom,options) {
  if(converter[geom.type]) {
    var opt = extend(extend({},this.options), options || {});
    var output = opt.output || 'svg';
    var paths = converter[geom.type].call(this,geom,
      this.res,
      {x:this.mapExtent.left,y:this.mapExtent.top},
      opt
    );
    var svgJsons,svgEles;
    if (output.toLowerCase() == 'svg') {
      svgJsons = paths.map(function(path) {
        return pathToSvgJson(path,geom.type,opt.attributes,opt);
      });
      svgEles = svgJsons.map(function(json) {
        return jsonToSvgElement(json,geom.type);
      });
      return svgEles;
    } else {
      return paths;
    }
  } else {
    return;
  }
};
var pathToSvgJson = function(path,type,attributes,opt) {
  var svg = {};
  var forcePath = opt && opt.hasOwnProperty('forcePath') ? opt.forcePath
     : true;
  if((type == 'Point' || type == 'MultiPoint') && !forcePath) {
    svg['cx'] = path.split(',')[0];
    svg['cy'] = path.split(',')[1];
    svg['r'] = opt && opt.r ? opt.r : '1';
  } else {
    svg = {d: path};
    if(type == 'Polygon' || type == 'MultiPolygon') {
      svg['fill-rule'] == 'evenodd'; 
    } 
  }
  for (var key in attributes) {
    svg[key]= attributes[key];
  }
  return svg;
};
var jsonToSvgElement = function(json,type,opt) {
  var forcePath = opt && opt.hasOwnProperty('forcePath') ? opt.forcePath
     : true;
  var ele ='<path';
  if((type == 'Point' || type == 'MultiPoint') && !forcePath) {
    ele = '<circle';
  }
  for(var key in json) {
    ele += ' ' + key +'="' + json[key] + '"';
  }
  ele += '/>';
  return ele;
};

module.exports = g2svg;

},{"./converter.js":"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/geojson2svg/src/converter.js","xtend":"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/geojson2svg/node_modules/xtend/immutable.js"}],"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/geojson2svg/src/main.js":[function(require,module,exports){
var g2svg = require('./instance.js');
var geojson2svg = function(viewportSize,options) {
  if(!viewportSize) return;
  return new g2svg(viewportSize,options);
};

module.exports = geojson2svg;

},{"./instance.js":"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/geojson2svg/src/instance.js"}],"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/get-json-data/index.js":[function(require,module,exports){
// get-json-data
//code from https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started
(function() {
  var httpRequest;

  var makeRequest = function(url,callback,opt) {
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
      httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE
      try {
        httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
      } 
      catch (e) {
        try {
          httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        } 
        catch (e) {}
      }
    }

    if (!httpRequest) {
      callback.call(this,
        'Giving up :( Cannot create an XMLHTTP instance',
        null);
      return false;
    }
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          try {
            var data = JSON.parse(httpRequest.responseText);
          } catch (e) {
            callback.call(this, e,null);
            return;
          }
          callback.call(this,null,data);
        } else {
          callback.call(this,
            'There was a problem with the request.',
            null);
        }
      }
    };
    httpRequest.open('GET', url);
    httpRequest.send();
  }

  if(typeof module !== 'undefined' && module.exports) {
    module.exports = makeRequest;
  }
  if(typeof window!== 'undefined') {
    window.getJSONData = makeRequest;
  } 
})();

},{}],"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/parse-svg/index.js":[function(require,module,exports){
(function() {
  //cource code from http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
	function parseSVG(s) {
	  var div= document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
	  div.innerHTML= '<svg xmlns="http://www.w3.org/2000/svg">'+s+'</svg>';
	  var frag= document.createDocumentFragment();
	  while (div.firstChild.firstChild)
	    frag.appendChild(div.firstChild.firstChild);
	  return frag;
	}
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = parseSVG;
  }
  if (typeof window !== 'undefined') {
    window.parseSVG = parseSVG;
  }
})();

},{}],"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/reproject-spherical-mercator/index.js":[function(require,module,exports){
// reproject-spherical-mercator index.js
var SphericalMercator = require('sphericalmercator'),
  sm = new SphericalMercator({size: 256});
function projCoords(coords) {
  return coords.map(function(coord) {
    return sm.forward(coord);
  });
}

var reproject = function(g) {
  var gre = {type: g.type};
  if (g.type == 'Point') {
    gre.coordinates = sm.forward(g.coordinates);
  } else if (g.type == 'LineString' || g.type == 'MultiPoint') {
    gre.coordinates = projCoords(g.coordinates);
  } else if (g.type == 'Polygon' || g.type == 'MultiLineString') {
    gre.coordinates = g.coordinates.map(function(part) {
      return projCoords(part);
    });
  } else if (g.type =='MultiPolygon') {
    gre.coordinates = g.coordinates.map(function(poly) {
      return poly.map(function(part) {
        return projCoords(part);
      });
    });
  } else if (g.type == 'Feature') {
    gre.geometry = reproject(g.geometry);
    if (g.id) gre.id = g.id;
    if (g.properties) gre.properties = g.properties;
  } else {
    throw 'Not valid geojson';  
  }
  return gre; 
};

module.exports = reproject;

},{"sphericalmercator":"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/reproject-spherical-mercator/node_modules/sphericalmercator/sphericalmercator.js"}],"/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/node_modules/reproject-spherical-mercator/node_modules/sphericalmercator/sphericalmercator.js":[function(require,module,exports){
var SphericalMercator = (function(){

// Closures including constants and other precalculated values.
var cache = {},
    EPSLN = 1.0e-10,
    D2R = Math.PI / 180,
    R2D = 180 / Math.PI,
    // 900913 properties.
    A = 6378137.0,
    MAXEXTENT = 20037508.342789244;


// SphericalMercator constructor: precaches calculations
// for fast tile lookups.
function SphericalMercator(options) {
    options = options || {};
    this.size = options.size || 256;
    if (!cache[this.size]) {
        var size = this.size;
        var c = cache[this.size] = {};
        c.Bc = [];
        c.Cc = [];
        c.zc = [];
        c.Ac = [];
        for (var d = 0; d < 30; d++) {
            c.Bc.push(size / 360);
            c.Cc.push(size / (2 * Math.PI));
            c.zc.push(size / 2);
            c.Ac.push(size);
            size *= 2;
        }
    }
    this.Bc = cache[this.size].Bc;
    this.Cc = cache[this.size].Cc;
    this.zc = cache[this.size].zc;
    this.Ac = cache[this.size].Ac;
};

// Convert lon lat to screen pixel value
//
// - `ll` {Array} `[lon, lat]` array of geographic coordinates.
// - `zoom` {Number} zoom level.
SphericalMercator.prototype.px = function(ll, zoom) {
    var d = this.zc[zoom];
    var f = Math.min(Math.max(Math.sin(D2R * ll[1]), -0.9999), 0.9999);
    var x = Math.round(d + ll[0] * this.Bc[zoom]);
    var y = Math.round(d + 0.5 * Math.log((1 + f) / (1 - f)) * (-this.Cc[zoom]));
    (x > this.Ac[zoom]) && (x = this.Ac[zoom]);
    (y > this.Ac[zoom]) && (y = this.Ac[zoom]);
    //(x < 0) && (x = 0);
    //(y < 0) && (y = 0);
    return [x, y];
};

// Convert screen pixel value to lon lat
//
// - `px` {Array} `[x, y]` array of geographic coordinates.
// - `zoom` {Number} zoom level.
SphericalMercator.prototype.ll = function(px, zoom) {
    var g = (px[1] - this.zc[zoom]) / (-this.Cc[zoom]);
    var lon = (px[0] - this.zc[zoom]) / this.Bc[zoom];
    var lat = R2D * (2 * Math.atan(Math.exp(g)) - 0.5 * Math.PI);
    return [lon, lat];
};

// Convert tile xyz value to bbox of the form `[w, s, e, n]`
//
// - `x` {Number} x (longitude) number.
// - `y` {Number} y (latitude) number.
// - `zoom` {Number} zoom.
// - `tms_style` {Boolean} whether to compute using tms-style.
// - `srs` {String} projection for resulting bbox (WGS84|900913).
// - `return` {Array} bbox array of values in form `[w, s, e, n]`.
SphericalMercator.prototype.bbox = function(x, y, zoom, tms_style, srs) {
    // Convert xyz into bbox with srs WGS84
    if (tms_style) {
        y = (Math.pow(2, zoom) - 1) - y;
    }
    // Use +y to make sure it's a number to avoid inadvertent concatenation.
    var ll = [x * this.size, (+y + 1) * this.size]; // lower left
    // Use +x to make sure it's a number to avoid inadvertent concatenation.
    var ur = [(+x + 1) * this.size, y * this.size]; // upper right
    var bbox = this.ll(ll, zoom).concat(this.ll(ur, zoom));

    // If web mercator requested reproject to 900913.
    if (srs === '900913') {
        return this.convert(bbox, '900913');
    } else {
        return bbox;
    }
};

// Convert bbox to xyx bounds
//
// - `bbox` {Number} bbox in the form `[w, s, e, n]`.
// - `zoom` {Number} zoom.
// - `tms_style` {Boolean} whether to compute using tms-style.
// - `srs` {String} projection of input bbox (WGS84|900913).
// - `@return` {Object} XYZ bounds containing minX, maxX, minY, maxY properties.
SphericalMercator.prototype.xyz = function(bbox, zoom, tms_style, srs) {
    // If web mercator provided reproject to WGS84.
    if (srs === '900913') {
        bbox = this.convert(bbox, 'WGS84');
    }

    var ll = [bbox[0], bbox[1]]; // lower left
    var ur = [bbox[2], bbox[3]]; // upper right
    var px_ll = this.px(ll, zoom);
    var px_ur = this.px(ur, zoom);
    // Y = 0 for XYZ is the top hence minY uses px_ur[1].
    var bounds = {
        minX: Math.floor(px_ll[0] / this.size),
        minY: Math.floor(px_ur[1] / this.size),
        maxX: Math.floor((px_ur[0] - 1) / this.size),
        maxY: Math.floor((px_ll[1] - 1) / this.size)
    };
    if (tms_style) {
        var tms = {
            minY: (Math.pow(2, zoom) - 1) - bounds.maxY,
            maxY: (Math.pow(2, zoom) - 1) - bounds.minY
        };
        bounds.minY = tms.minY;
        bounds.maxY = tms.maxY;
    }
    return bounds;
};

// Convert projection of given bbox.
//
// - `bbox` {Number} bbox in the form `[w, s, e, n]`.
// - `to` {String} projection of output bbox (WGS84|900913). Input bbox
//   assumed to be the "other" projection.
// - `@return` {Object} bbox with reprojected coordinates.
SphericalMercator.prototype.convert = function(bbox, to) {
    if (to === '900913') {
        return this.forward(bbox.slice(0, 2)).concat(this.forward(bbox.slice(2,4)));
    } else {
        return this.inverse(bbox.slice(0, 2)).concat(this.inverse(bbox.slice(2,4)));
    }
};

// Convert lon/lat values to 900913 x/y.
SphericalMercator.prototype.forward = function(ll) {
    var xy = [
        A * ll[0] * D2R,
        A * Math.log(Math.tan((Math.PI*0.25) + (0.5 * ll[1] * D2R)))
    ];
    // if xy value is beyond maxextent (e.g. poles), return maxextent.
    (xy[0] > MAXEXTENT) && (xy[0] = MAXEXTENT);
    (xy[0] < -MAXEXTENT) && (xy[0] = -MAXEXTENT);
    (xy[1] > MAXEXTENT) && (xy[1] = MAXEXTENT);
    (xy[1] < -MAXEXTENT) && (xy[1] = -MAXEXTENT);
    return xy;
};

// Convert 900913 x/y values to lon/lat.
SphericalMercator.prototype.inverse = function(xy) {
    return [
        (xy[0] * R2D / A),
        ((Math.PI*0.5) - 2.0 * Math.atan(Math.exp(-xy[1] / A))) * R2D
    ];
};

return SphericalMercator;

})();

if (typeof module !== 'undefined' && typeof exports !== 'undefined') {
    module.exports = exports = SphericalMercator;
}

},{}]},{},["/home/gaganb/projects/maps-on-blackboard/maps-on-blackboard.github.io/src/contents/articles/basic-map-test/js/main.js"]);
