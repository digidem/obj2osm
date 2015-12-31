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

var toxml = require('../')
var q = [
  [ 38.89958342598271, 38.90385833966776 ],
  [ -77.02514648437499, -77.01965332031249 ]
]
osm.queryStream(q)
  .pipe(toxml(q))
  .pipe(process.stdout)
