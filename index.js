var h = require('./lib/h.js')
var through = require('through2')

module.exports = function (q) {
  var stream = through.obj(write, end)
  stream.push(h('?xml', { version: '1.0', encoding: 'UTF-8' }, [
    h('osm!', { version: '0.6', generator: 'osm-p2p' }, [
      h('bounds/', {
        minlat: q[0][0], maxlat: q[0][1],
        minlon: q[1][0], maxlon: q[1][1]
      })
    ])
  ]))
  return stream

  function write (row, enc, next) {
    var children = []
    ;(row.refs || []).forEach(function (ref) {
      children.push(h('nd/', { ref: ref }))
    })
    delete row.refs

    ;(row.members || []).forEach(function (ref) {
      children.push(h('member/', {
        type: 'relation',
        ref: ref,
        role: ''
      }))
    })
    delete row.members

    Object.keys(row.tags || {}).forEach(function (key) {
      children.push(h('tag/', { k: key, v: row.tags[key] }))
    })
    delete row.tags

    var tag = row.type
    delete row.type
    next(null, h(tag, row, children))
  }
  function end (next) {
    this.push('</osm>\n')
    next()
  }
}
