var speedFilter = require("speed-filter");
var Victor = require('victor');

function Vectorize() {}

Vectorize.prototype.toAccelerations = function(points) {
    points = this.standardize(points);
    var velocities = this.toVelocities(points);
    var accels = [],
        time;
    for (var i = 0; i < velocities.length - 1; i++) {
        time = speedFilter.calcElapsed(points[i + 1].time, points[i + 2].time);
        accels.push(this.accelerationVector(velocities[i], velocities[i + 1], time));
    }
    return accels;
};
Vectorize.prototype.accelerationVector = function(v1, v2, time) {
    var vDif = v2.subtract(v1);
    return new Victor(vDif.x / time, vDif.y / time);
};
Vectorize.prototype.toVelocities = function(points) {
    points = this.standardize(points);
    var vectors = [];
    for (var i = 0; i < points.length - 1; i++) {
        vectors.push(this.velocityVector(points[i], points[i + 1]));
    }
    return vectors;
};
Vectorize.prototype.velocityVector = function(pt1, pt2) {
    var speed = speedFilter.calcSpeeds([pt1, pt2]),
        latDif = pt2.lat - pt1.lat,
        lngDif = pt2.lng - pt1.lng,
        x = Math.abs(speed * Math.cos(Math.atan(latDif / lngDif)))
        y = Math.abs(speed * Math.sin(Math.atan(latDif / lngDif)));
        if(pt1.lat > pt2.lat)
          y*=-1;
        if(pt1.lng > pt2.lng)
          x*=-1;
    return new Victor(x, y);
};
Vectorize.prototype.toPositions = function(points) {
    points = this.standardize(points);
    var vectors = [];
    for (var i = 0; i < points.length - 1; i++) {
        vectors.push(this.positionVector(points[i], points[i + 1]));
    }
    return vectors;
};
Vectorize.prototype.positionVector = function(pt1, pt2) {
    var dist = getDistance(pt1.lat, pt1.lng, pt2.lat, pt2.lng),
        latDif = Math.abs(pt1.lat - pt2.lat),
        lngDif = Math.abs(pt1.lng - pt2.lng),
        x = dist * Math.cos(Math.atan(latDif / lngDif)),
        y = dist * Math.sin(Math.atan(latDif / lngDif));
    return new Victor(x, y);
};
Vectorize.prototype.standardize = function(points) {
    return points.map(function(v) {
        var obj;
        if (v.hasOwnProperty('lat'))
            obj = {
                lat: v.lat,
                lng: v.lng
            };
        if (v.hasOwnProperty('latitude'))
            obj = {
                lat: v.latitude,
                lng: v.longitude
            };
        if (v.hasOwnProperty('y'))
            obj = {
                lat: v.y,
                lng: v.x
            };
        if (v.hasOwnProperty('time'))
            obj.time = v.time;
        if (v.hasOwnProperty('timestamp'))
            obj.time = v.timestamp;
        if (v.hasOwnProperty('starttime'))
            obj.time = v.starttime;
        return obj;
    });
};

var getDistance = function(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d * 1000; // Distance in Meters
};
var deg2rad = function deg2rad(deg) {
    return deg * (Math.PI / 180);
};

module.exports = exports = new Vectorize();
