# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.1] - 2016-08-24
### Fixed
- Skip objects with an invalid `type` property (not one of `node|way|relation|bounds|changeset`)

## [2.0.0] - 2016-08-22
### Changed
- Renamed from osm-p2p-xml to obj2osm
- Constructor takes `options` object instead of `query` array
- Whitelist attributes to valid OSM XML attributes
- Relation members is an array of objects with `ref,type,role` props, not an array of ids
- `nodes, ways, relations` with no tags, members or nodes are self-closing in output XML

### Added
- Will output valid osmChange if input objects have `action` property set
- Optional custom root element
- Optional bounds
- Optional custom generator attribute

[2.0.1]: https://github.com/digidem/obj2osm/compare/v2.0.1...v2.0.0
[2.0.0]: https://github.com/digidem/obj2osm/compare/v2.0.0...v1.0.2
