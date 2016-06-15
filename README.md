[![Build Status](https://img.shields.io/travis/digidem/osm-p2p-xml.svg)](https://travis-ci.org/digidem/osm-p2p-xml)
[![npm](https://img.shields.io/npm/v/osm-p2p-xml.svg?maxAge=2592000)](https://www.npmjs.com/package/osm-p2p-xml)

# osm-p2p-xml

generate open street map xml from an osm-p2p-db query

# example

``` js
var level = require('level')
var hyperlog = require('hyperlog')
var fdstore = require('fd-chunk-store')
var db = {
  log: level('/tmp/osm-p2p/log'),
  index: level('/tmp/osm-p2p/index')
}

var osmdb = require('osm-p2p-db')
var osm = osmdb({
  log: hyperlog(db.log, { valueEncoding: 'json' }),
  db: db.index,
  store: fdstore(4096, '/tmp/osm-p2p/tree'),
  size: 4096
})

var toxml = require('osm-p2p-xml')
var q = [
  [ 38.89958342598271, 38.90385833966776 ],
  [ -77.02514648437499, -77.01965332031249 ]
]
osm.queryStream(q)
  .pipe(toxml(q))
  .pipe(process.stdout)
```

output:

```
$ node osm.js
<?xml version="1.0" encoding="UTF-8"?><osm><bounds minlat="38.89958342598271" maxlat="38.90385833966776" minlon="-77.02514648437499" maxlon="-77.01965332031249"/><node lat="38.90094671136515" lon="-77.02313139881134" timestamp="2015-12-31T20:50:35.826Z" id="1db08fd46c5a7c01" version="334fd5b5114e0ae69c151978640cd5692c9fb639c7565ba48b0cd2700e1d8547"></node><way v="5" timestamp="2015-12-31T20:50:35.842Z" id="29ac0c8f50e630e9" version="57f9ec2913db5e568976372afa8997255fdb614cff48ca01565f2ddee3687bc8"><nd ref="1db08fd46c5a7c01"/><nd ref="8c50fa92c3ce91d7"/><nd ref="83c1be761a9f4148"/><nd ref="1db08fd46c5a7c01"/><tag k="area" v="yes"/></way><node lat="38.90068996279713" lon="-77.02327892030715" timestamp="2015-12-31T20:50:35.849Z" id="8c50fa92c3ce91d7" version="8f32080b4501459d8a904c568e2a0c7de92de435fab8c7d16ae2b39851046991"></node><node lat="38.90084129844752" lon="-77.02284037913323" timestamp="2015-12-31T20:50:35.855Z" id="83c1be761a9f4148" version="0443c3916e92250149c8086ed21b2265cb6af161dbf63a17e30a7d3c8a0cb0b1"></node></osm>
```

# api

``` js
var toxml = require('osm-p2p-xml')
```

## var stream = toxml(query)

Return a transform object `stream` that expects [osm-p2p-db][1] queryStream data
as input and produces [osm xml][2] output.

Node object format:

* `node.type` - `'node'`
* `node.id` - id string
* `node.version` - version string
* `node.lat` - latitude in degrees
* `node.lon` - longitude in degrees

Way object format:

* `way.type` - `'way'`
* `way.id` - id string
* `way.version` - version string
* `way.refs` - array of node IDs

Relation object format:

* `relation.type` - `relation.type`
* `relation.id` - id string
* `relation.version` - version string
* `relation.members` - array of member (node, way, or relation) IDs

[1]: https://npmjs.com/package/osm-p2p-db
[2]: http://wiki.openstreetmap.org/wiki/API_v0.6#XML_Format

# install

```
npm install osm-p2p-xml
```

# license

BSD
