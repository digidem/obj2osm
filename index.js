var h = require('./lib/h.js')
var through = require('through2')

var DEFAULTS = {
  root: 'osm',
  generator: 'obj2osm'
}

var DEFAULT_MEMBER = {
  ref: '',
  type: '',
  role: ''
}

module.exports = function (opts) {
  opts = Object.assign({}, DEFAULTS, opts)
  if (Array.isArray(opts.bounds)) {
    var q = opts.bounds
    opts.bounds = {
      minlat: q[0][0], maxlat: q[0][1],
      minlon: q[1][0], maxlon: q[1][1]
    }
  }

  var stream = through.obj(write, end)

  if (opts.root) {
    stream.push(h('?xml', { version: '1.0', encoding: 'UTF-8' }))
    stream.push(h(opts.root + '!', { version: '0.6', generator: opts.generator }))
  }
  if (opts.bounds) {
    stream.push(h('bounds', opts.bounds))
  }

  return stream

  function write (row, enc, next) {
    var children = []
    ;(row.refs || []).forEach(function (ref) {
      children.push(h('nd', { ref: ref }))
    })
    delete row.refs

    ;(row.members || []).forEach(function (member) {
      children.push(h('member', Object.assign({}, DEFAULT_MEMBER, member)))
    })
    delete row.members

    Object.keys(row.tags || {}).forEach(function (key) {
      children.push(h('tag', { k: key, v: row.tags[key] }))
    })
    delete row.tags

    var tag = row.type
    delete row.type
    next(null, h(tag, row, children))
  }

  function end (next) {
    if (opts.root) {
      this.push('</' + opts.root + '>\n')
    }
    next()
  }
}
