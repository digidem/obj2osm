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

// Attributes that are not in these whitelists are ignored.
// Any node that is a child of a VALID_NODE that is not in `children` will throw an error
var ELEMENT_ATTRIBUTES = ['id', 'user', 'uid', 'visible', 'version', 'changeset', 'timestamp', 'old_id', 'new_id', 'new_version']
var WHITELISTS = {
  node: {
    attributes: ELEMENT_ATTRIBUTES.concat(['lat', 'lon']),
    children: ['tag']
  },
  way: {
    attributes: ELEMENT_ATTRIBUTES,
    children: ['nd', 'tag']
  },
  relation: {
    attributes: ELEMENT_ATTRIBUTES,
    children: ['member', 'tag']
  },
  changeset: {
    attributes: ['id', 'user', 'uid', 'created_at', 'closed_at', 'open',
        'min_lat', 'min_lon', 'max_lat', 'max_lon', 'comments_count'],
    children: ['tag']
  },
  bounds: {
    attributes: ['minlon', 'minlat', 'maxlon', 'maxlat']
  }
}

module.exports = function (opts) {
  opts = Object.assign({}, DEFAULTS, opts)
  if (Array.isArray(opts.bounds)) {
    var q = opts.bounds
    opts.bounds = {
      minlat: q[0][0],
      maxlat: q[0][1],
      minlon: q[1][0],
      maxlon: q[1][1]
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

    ;(row.members || []).forEach(function (member) {
      children.push(h('member', Object.assign({}, DEFAULT_MEMBER, member)))
    })

    Object.keys(row.tags || {}).forEach(function (key) {
      children.push(h('tag', { k: key, v: row.tags[key] }))
    })

    var attr = filterProps(row, WHITELISTS[row.type].attributes)
    next(null, h(row.type, attr, children))
  }

  function end (next) {
    if (opts.root) {
      this.push('</' + opts.root + '>\n')
    }
    next()
  }
}

function filterProps (obj, props) {
  var result = {}
  Object.keys(obj).forEach(function (prop) {
    if (props.indexOf(prop) === -1) return
    result[prop] = obj[prop]
  })
  return result
}
