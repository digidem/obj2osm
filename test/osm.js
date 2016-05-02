var test = require('tape')
var toxml = require('../')
var concat = require('concat-stream')
var parse = require('virtual-html')

var expected = '<?xml version="1.0" encoding="UTF-8"?>'
  + '<osm version="0.6" generator="osm-p2p">'
  + '<bounds minlat="38.89958342598271" maxlat="38.90385833966776"'
    + ' minlon="-77.02514648437499" maxlon="-77.01965332031249"/>'
  + '<node lat="38.90094671136515" lon="-77.02313139881134"'
    + ' timestamp="2015-12-31T20:50:35.826Z" id="1db08fd46c5a7c01"'
    + ' version="334fd5b5114e0ae69c151978640cd5692c9fb639c7565ba48b0cd2700e1d8547">'
  + '</node>'
  + '<way v="5" timestamp="2015-12-31T20:50:35.842Z" id="29ac0c8f50e630e9"'
    + ' version="57f9ec2913db5e568976372afa8997255fdb614cff48ca01565f2ddee3687bc8">'
    + '<nd ref="1db08fd46c5a7c01"/>'
    + '<nd ref="8c50fa92c3ce91d7"/>'
    + '<nd ref="83c1be761a9f4148"/>'
    + '<nd ref="1db08fd46c5a7c01"/>'
    + '<tag k="area" v="yes"/>'
  + '</way>'
  + '<node lat="38.90068996279713" lon="-77.02327892030715"'
    + ' timestamp="2015-12-31T20:50:35.849Z" id="8c50fa92c3ce91d7"'
    + ' version="8f32080b4501459d8a904c568e2a0c7de92de435fab8c7d16ae2b39851046991">'
  + '</node>'
  + '<node lat="38.90084129844752" lon="-77.02284037913323"'
    + ' timestamp="2015-12-31T20:50:35.855Z" id="83c1be761a9f4148"'
    + ' version="0443c3916e92250149c8086ed21b2265cb6af161dbf63a17e30a7d3c8a0cb0b1">'
    + '</node>'
  + '</osm>'

test('query', function (t) {
  t.plan(1)
  var q = [
    [ 38.89958342598271, 38.90385833966776 ],
    [ -77.02514648437499, -77.01965332031249 ]
  ]
  var stream = toxml(q)
  stream.pipe(concat(function (body) {
    t.deepEqual(parse(body.toString()), parse(expected), 'compare html tree')
  }))
  stream.write({
    type: 'node',
    lat: 38.90094671136515,
    lon: -77.02313139881134,
    timestamp: '2015-12-31T20:50:35.826Z',
    id: '1db08fd46c5a7c01',
    version: '334fd5b5114e0ae69c151978640cd5692c9fb639c7565ba48b0cd2700e1d8547'
  })
  stream.write({
    type: 'way',
    v: 5,
    timestamp: '2015-12-31T20:50:35.842Z',
    id: '29ac0c8f50e630e9',
    version: '57f9ec2913db5e568976372afa8997255fdb614cff48ca01565f2ddee3687bc8',
    refs: ['1db08fd46c5a7c01','8c50fa92c3ce91d7',
      '83c1be761a9f4148','1db08fd46c5a7c01'],
    tags: { area: 'yes' }
  })
  stream.write({
    type: 'node',
    lat: 38.90068996279713,
    lon: -77.02327892030715,
    timestamp: '2015-12-31T20:50:35.849Z',
    id: '8c50fa92c3ce91d7',
    version: '8f32080b4501459d8a904c568e2a0c7de92de435fab8c7d16ae2b39851046991'
  })
  stream.write({
    type: 'node',
    lat: 38.90084129844752,
    lon: -77.02284037913323,
    timestamp: '2015-12-31T20:50:35.855Z',
    id: '83c1be761a9f4148',
    version: '0443c3916e92250149c8086ed21b2265cb6af161dbf63a17e30a7d3c8a0cb0b1'
  })
  stream.end()
})
