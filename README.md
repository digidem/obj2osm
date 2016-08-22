# obj2osm

[![Build Status](https://img.shields.io/travis/digidem/obj2osm.svg)](https://travis-ci.org/digidem/obj2osm)
[![npm](https://img.shields.io/npm/v/obj2osm.svg)](https://www.npmjs.com/package/obj2osm)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?maxAge=2592000)](http://standardjs.com/)

> Generate OSM XML from a stream of objects matching [OSM JSON](http://overpass-api.de/output_formats.html#json)

## Table of Contents

- [Install](#install)
- [Example](#example)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Install

```
npm install obj2osm
```


## Example

``` js
var toxml = require('../')
var from2Array = require('from2-array')

var input = require('../test/fixture.json')

var bounds = {
  minlat: 38.89958342598271,
  maxlat: 38.90385833966776,
  minlon: -77.02514648437499,
  maxlon: -77.01965332031249
}

from2Array.obj(input)
  .pipe(toxml({bounds: bounds}))
  .pipe(process.stdout)
```

output:

```
$ node osm.js
<?xml version="1.0" encoding="UTF-8"?><osm version="0.6" generator="obj2osm"><bounds minlat="38.89958342598271" maxlat="38.90385833966776" minlon="-77.02514648437499" maxlon="-77.01965332031249"/><node lat="38.90094671136515" lon="-77.02313139881134" timestamp="2015-12-31T20:50:35.826Z" id="1db08fd46c5a7c01" version="334fd5b5114e0ae69c151978640cd5692c9fb639c7565ba48b0cd2700e1d8547"/><way timestamp="2015-12-31T20:50:35.842Z" id="29ac0c8f50e630e9" version="57f9ec2913db5e568976372afa8997255fdb614cff48ca01565f2ddee3687bc8"><nd ref="1db08fd46c5a7c01"/><nd ref="8c50fa92c3ce91d7"/><nd ref="83c1be761a9f4148"/><nd ref="1db08fd46c5a7c01"/><tag k="area" v="yes"/></way><node lat="38.90068996279713" lon="-77.02327892030715" timestamp="2015-12-31T20:50:35.849Z" id="8c50fa92c3ce91d7" version="8f32080b4501459d8a904c568e2a0c7de92de435fab8c7d16ae2b39851046991"><tag k="amenity" v="cafe"/></node><relation timestamp="2015-12-31T20:50:35.855Z" id="83c1be761a9f4148" version="0443c3916e92250149c8086ed21b2265cb6af161dbf63a17e30a7d3c8a0cb0b1"><member ref="8c50fa92c3ce91d7" type="node" role=""/></relation></osm>
```

## API

``` js
var toxml = require('obj2osm')
```

### var stream = toxml(opts)

Where:

* `opts.root` - Root XML element (default: `osm`, set to `null` to output XML with no root)
* `opts.generator` - Generator attribute for the root element (default: `obj2osm`)
* `opts.bounds` - Optional bounds to include at start of XML, either `{minlat: <Number>, maxlat: <Number>, minlon: <Number>, maxlon: <Number>}` or `[[minLat, maxLat], [minLon, maxLon]]`

Returns a transform object `stream` that expects a stream of objects matching [OSM JSON format](http://overpass-api.de/output_formats.html#json) as input and produces [osm xml][1] output or [osmChange XML][2] output if input objects have an action property set to one of: `create|modify|delete`.

Node object format:

* `node.type` - `'node'`
* `node.id` - id string
* `node.version` - version string
* `node.lat` - latitude in degrees
* `node.lon` - longitude in degrees
* `node.tags` - Object of tag key-value pairs: `{tagKey: 'tagValue', amenity: 'cafe'}`

Way object format:

* `way.type` - `'way'`
* `way.id` - id string
* `way.version` - version string
* `way.nodes` - array of node IDs
* `way.tags` - Object of tag key-value pairs

Relation object format:

* `relation.type` - `relation.type`
* `relation.id` - id string
* `relation.version` - version string
* `relation.members` - array of member objects: `{type: 'node|way|relation', ref: 'id', role: 'role'}`
* `relation.tags` - Object of tag key-value pairs

[1]: http://wiki.openstreetmap.org/wiki/API_v0.6#XML_Format
[2]: http://wiki.openstreetmap.org/wiki/OsmChange

## Contribute

PRs welcome. Please follow [JS Standard Style](http://standardjs.com/).

## License

BSD
