var chai = require("chai");
var expect = chai.expect;
var Vectorize = require('./vectorize.js');
var speedFilter = require('speed-filter'),
points = [{
    lng: -88.19593,
    lat: 40.1108353,
    time: '2016-07-11T17:48:42.489Z'
}, {
    lng: -88.1944071,
    lat: 40.1079313,
    time: '2016-07-11T17:52:39.716Z'
}, {
    lng: -88.1953208,
    lat: 40.1077055,
    time: '2016-07-11T17:52:57.270Z'
}, {
    lng: -88.1955493,
    lat: 40.1062688,
    time: '2016-07-11T17:53:33.622Z'
}, {
    lng: -88.1949401,
    lat: 40.1056192,
    time: '2016-07-11T17:54:50.591Z'
}, {
    lng: -88.1932268,
    lat: 40.1060327,
    time: '2016-07-11T17:55:59.240Z'
}, {
    lng: -88.1917419,
    lat: 40.1051694,
    time: '2016-07-11T17:56:12.507Z'
}, {
    lng: -88.1921988,
    lat: 40.1058967,
    time: '2016-07-11T17:57:11.741Z'
}, {
    lng: -88.1896857,
    lat: 40.1052974,
    time: '2016-07-11T17:57:29.459Z'
}, {
    lng: -88.1895334,
    lat: 40.105215,
    time: '2016-07-11T17:59:52.109Z'
}, {
    lng: -88.1867917,
    lat: 40.1062125,
    time: '2016-07-11T18:00:09.763Z'
}];
describe("To Position Vectors", function() {
    var positions = Vectorize.toPositions(points);
    it("should return vectors", function() {
        for (var i = 0; i < positions.length; i++) {
            expect(Math.abs(positions[i].x)).to.be.above(0);
            expect(Math.abs(positions[i].y)).to.be.above(0);
        }
    });
    it("should have one less point", function() {
        expect(positions.length - points.length).to.be.equal(-1);
    });
});
describe("To Velocity Vectors", function() {
    var velocities = Vectorize.toVelocities(points);
    it("should return vectors", function() {
        for (var i = 0; i < velocities.length; i++) {
            expect(Math.abs(velocities[i].x)).to.be.above(0);
            expect(Math.abs(velocities[i].y)).to.be.above(0);
        }
    });
    it("should have one less point", function() {
        expect(velocities.length - points.length).to.be.equal(-1);
    });
});
describe("To Acceleration Vectors", function() {
    var accels = Vectorize.toAccelerations(points);
    it("should return vectors", function() {
        for (var i = 0; i < accels.length; i++) {
            expect(Math.abs(accels[i].x)).to.be.above(0);
            expect(Math.abs(accels[i].y)).to.be.above(0);
        }
    });
    it("should have two less points than GPS", function() {
        expect(accels.length - points.length).to.be.equal(-2);
    });
});


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
describe("Produce Acceleration Vector", function() {
    var vels = Vectorize.toVelocities(points.slice(0,3));
    var accel = Vectorize.accelerationVector(vels[0],vels[1],speedFilter.calcElapsed(points[1].time,points[2].time));
    it("should have the correct magnitude", function(){
      expect(Math.abs(accel.magnitude())).to.be.below(0.5);
    });
});
describe("Produce Velocity Vector", function() {
  var vel = Vectorize.velocityVector(points[0],points[1]);
    it("should have the correct magnitude", function(){
      expect(Math.abs(vel.magnitude()-1.47)).to.be.below(0.05);
    });
});
describe("Produce Position Vector", function() {
    var pos = Vectorize.positionVector(points[0],points[1]);
    it("should have the correct magnitude", function(){
      expect(Math.abs(pos.magnitude()-348)).to.be.below(1);
    });
});
