var test = require('tape')
var toxml = require('../')
var concat = require('concat-stream')
var parse = require('virtual-html')

var input = require('./fixture.json')

var expectedNoRootNoBounds = '<node lat="38.90094671136515" lon="-77.02313139881134"' +
  ' timestamp="2015-12-31T20:50:35.826Z" id="1db08fd46c5a7c01"' +
  ' version="334fd5b5114e0ae69c151978640cd5692c9fb639c7565ba48b0cd2700e1d8547">' +
  '</node>' +
  '<way timestamp="2015-12-31T20:50:35.842Z" id="29ac0c8f50e630e9"' +
  ' version="57f9ec2913db5e568976372afa8997255fdb614cff48ca01565f2ddee3687bc8">' +
  '<nd ref="1db08fd46c5a7c01"/>' +
  '<nd ref="8c50fa92c3ce91d7"/>' +
  '<nd ref="83c1be761a9f4148"/>' +
  '<nd ref="1db08fd46c5a7c01"/>' +
  '<tag k="area" v="yes"/>' +
  '</way>' +
  '<node lat="38.90068996279713" lon="-77.02327892030715"' +
  ' timestamp="2015-12-31T20:50:35.849Z" id="8c50fa92c3ce91d7"' +
  ' version="8f32080b4501459d8a904c568e2a0c7de92de435fab8c7d16ae2b39851046991">' +
  '<tag k="amenity" v="cafe"/>' +
  '</node>' +
  '<relation timestamp="2015-12-31T20:50:35.855Z" id="83c1be761a9f4148"' +
  ' version="0443c3916e92250149c8086ed21b2265cb6af161dbf63a17e30a7d3c8a0cb0b1">' +
  '<member ref="8c50fa92c3ce91d7" type="node" role=""/>' +
  '</relation>' +
  '</osm>'

var expectedRootBounds = '<?xml version="1.0" encoding="UTF-8"?>' +
  '<osm version="0.6" generator="obj2osm">' +
  '<bounds minlat="38.89958342598271" maxlat="38.90385833966776"' +
  ' minlon="-77.02514648437499" maxlon="-77.01965332031249"/>' +
  expectedNoRootNoBounds +
  '</osm>'

var expectedRootNoBounds = '<?xml version="1.0" encoding="UTF-8"?>' +
  '<osm version="0.6" generator="obj2osm">' +
  expectedNoRootNoBounds +
  '</osm>'

var expectedNoRootBounds = '<bounds minlat="38.89958342598271" maxlat="38.90385833966776"' +
  ' minlon="-77.02514648437499" maxlon="-77.01965332031249"/>' +
  expectedNoRootNoBounds

test('root + bounds', function (t) {
  t.plan(1)
  var q = [
    [ 38.89958342598271, 38.90385833966776 ],
    [ -77.02514648437499, -77.01965332031249 ]
  ]
  var stream = toxml({bounds: q})
  stream.pipe(concat(function (body) {
    t.deepEqual(parse(body.toString()), parse(expectedRootBounds), 'compare html tree')
  })).on('error', t.error)
  input.forEach(function (obj) { stream.write(obj) })
  stream.end()
})

test('no root, no bounds', function (t) {
  t.plan(1)
  var stream = toxml({root: null})
  stream.pipe(concat(function (body) {
    t.deepEqual(parse(body.toString()), parse(expectedNoRootNoBounds), 'compare html tree')
  })).on('error', t.error)
  input.forEach(function (obj) { stream.write(obj) })
  stream.end()
})

test('root, no bounds', function (t) {
  t.plan(1)
  var stream = toxml()
  stream.pipe(concat(function (body) {
    t.deepEqual(parse(body.toString()), parse(expectedRootNoBounds), 'compare html tree')
  })).on('error', t.error)
  input.forEach(function (obj) { stream.write(obj) })
  stream.end()
})

test('bounds, no root', function (t) {
  t.plan(1)
  var q = [
    [ 38.89958342598271, 38.90385833966776 ],
    [ -77.02514648437499, -77.01965332031249 ]
  ]
  var stream = toxml({bounds: q, root: null})
  stream.pipe(concat(function (body) {
    t.deepEqual(parse(body.toString()), parse(expectedNoRootBounds), 'compare html tree')
  })).on('error', t.error)
  input.forEach(function (obj) { stream.write(obj) })
  stream.end()
})
