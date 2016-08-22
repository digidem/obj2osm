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
