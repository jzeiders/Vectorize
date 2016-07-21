[![Build Status](https://travis-ci.org/jzeiders/Vectorize.svg?branch=master)](https://travis-ci.org/jzeiders/Vectorize)[![Coverage Status](https://coveralls.io/repos/github/jzeiders/Speed-Filter/badge.svg?branch=master)](https://coveralls.io/github/jzeiders/Speed-Filter?branch=master)

# vectorize

Converts gps points to motion vectors using victor library, provides three types of vectors: position, velocity, and accleration. Useful for filtering and analysis of GPS data.



## Installation

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install vectorize --save
```
## Vectors:
```sh
  Position {x: ∆lng, y: ∆lat}
  Velocity  {x: ∆lng / ∆time, y: ∆lat / ∆time}
  Acceleration {x: ∆xVelocity / ∆time, y: ∆yVelocity / ∆time}
```
## Use
```sh
# Points is expected to be an array of GPS points with a latitude, longitude, and timestamp;
# Valid formats: Latitude: [lat, latitude, y]
#                Longitude[lng,longitude,x] 
#                Timestamp[time, timestamp, startime]
                
#Coordinate data in decimal, timestamp can be in any format momentjs can handle

#ALL SPEEDS ARE IN M/S
var vectorize = require('vectorize');

.toPositions(points)
  return arrayOfPositionVectors;
  
.toVelocities(points)
  returns arrayOfVelocityVectors;

.toAccelerations(points)
  returns arrayOfAccelerationVectors;
```
## Tests

```sh
npm install
npm test
```

## Dependencies

- [speed-filter](): Filters GPS data based on speed
- [victor](https://github.com/maxkueng/victor): A JavaScript 2D vector class with methods for common vector operations

## Dev Dependencies

- [chai](https://github.com/chaijs/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [coveralls](https://github.com/nickmerwin/node-coveralls): takes json-cov output into stdin and POSTs to coveralls.io
- [istanbul](https://github.com/gotwarlost/istanbul): Yet another JS code coverage tool that computes statement, line, function and branch coverage with module loader hooks to transparently add coverage when running tests. Supports all JS coverage use cases including unit tests, server side functional tests
- [mocha-lcov-reporter](https://github.com/StevenLooman/mocha-lcov-reporter): LCOV reporter for Mocha


## License

MIT

