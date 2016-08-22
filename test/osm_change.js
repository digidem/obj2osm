var test = require('tape')
var toxml = require('../')
var concat = require('concat-stream')
var parse = require('virtual-html')

var input = require('./osm_change.json')

var expected = '<?xml version="1.0" encoding="UTF-8"?>' +
  '<osmChange version="0.6" generator="obj2osm">' +
  '<create>' +
    '<node lat="38.90094671136515" lon="-77.02313139881134" timestamp="2015-12-31T20:50:35.826Z" id="-1" version="334fd5b5114e0ae69c151978640cd5692c9fb639c7565ba48b0cd2700e1d8547" />' +
  '</create>' +
  '<modify>' +
    '<way timestamp="2015-12-31T20:50:35.842Z" id="29ac0c8f50e630e9" version="57f9ec2913db5e568976372afa8997255fdb614cff48ca01565f2ddee3687bc8">' +
    '<nd ref="-1" />' +
    '<nd ref="8c50fa92c3ce91d7" />' +
    '<nd ref="83c1be761a9f4148" />' +
    '<nd ref="1db08fd46c5a7c01" />' +
    '<tag k="area" v="yes" />' +
    '</way>' +
    '<relation timestamp="2015-12-31T20:50:35.855Z" id="83c1be761a9f4148" version="0443c3916e92250149c8086ed21b2265cb6af161dbf63a17e30a7d3c8a0cb0b1">' +
    '<member ref="8c50fa92c3ce91d7" type="node" role="" />' +
    '</relation>' +
  '</modify>' +
  '<delete>' +
    '<node lat="38.90068996279713" lon="-77.02327892030715" timestamp="2015-12-31T20:50:35.849Z" id="8c50fa92c3ce91d7" version="8f32080b4501459d8a904c568e2a0c7de92de435fab8c7d16ae2b39851046991">' +
    '<tag k="amenity" v="cafe" />' +
    '</node>' +
  '</delete>' +
  '</osmChange>'

test('osmChange', function (t) {
  t.plan(1)
  var stream = toxml({root: 'osmChange'})
  stream.pipe(concat(function (body) {
    t.deepEqual(parse(body.toString()), parse(expected), 'compare html tree')
  })).on('error', t.error)
  input.forEach(function (obj) { stream.write(obj) })
  stream.end()
})
