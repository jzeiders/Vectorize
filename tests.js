var chai = require("chai");
var expect = chai.expect;
var Vectorize = require('./vectorize.js');
var speedFilter = require('speed-filter');
var points = [{
    lat: 0.000000,
    lng: 0.0000,
    time: '2016-07-11T17:48:42.489Z',
    tag: "A"
}, {
    lat: 0.00000001,
    lng: 0.01,
    time: '2016-07-11T18:20:42.489Z',
    tag: "B"

}, {
    lat: 0.01,
    lng: 0.0100001,
    time: '2016-07-11T18:21:20.489Z',
    tag: "C"

}, {
    lat: 0.000001,
    lng: 0.011,
    time: '2016-07-11T18:21:40.489Z',
    tag: "D"

}, {
lat: 0.002,
lng: 0.002,
time: '2016-07-11T18:50:20.489Z',
tag: "E"


},{
lat: 0.0021,
lng: 0.0021,
time: '2016-07-11T18:50:37.489Z',
tag: "F"

},
];
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
    console.log(velocities);
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
      expect(Math.abs(accel.magnitude())).to.be.below(0.8);
    });
});
describe("Produce Velocity Vector", function() {
  var vel = Vectorize.velocityVector(points[0],points[1]);
    it("should have the correct magnitude", function(){
      expect(Math.abs(vel.magnitude()-0.58)).to.be.below(0.05);
    });
});
describe("Produce Position Vector", function() {
    var pos = Vectorize.positionVector(points[0],points[1]);
    it("should have the correct magnitude", function(){
      expect(Math.abs(pos.magnitude()-1112)).to.be.below(1);
    });
});
