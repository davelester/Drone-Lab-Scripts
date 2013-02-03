var arDrone = require('ar-drone');
var drone  = arDrone.createdrone();

drone.takeoff();

// Drone flies in a square
drone
  .after(5000, function() {
    this.clockwise(0.5);
  })
  .after(2500, function() {
    this.stop();
    this.front(0.1);
  })
  .after(1000, function() {
		this.stop();
    this.clockwise(0.5);
  })
  .after(2500, function() {
    this.stop();
    this.front(0.1);
  })
  .after(1000, function() {
		this.stop();
    this.clockwise(0.5);
  })
  .after(2500, function() {
    this.stop();
    this.front(0.1);
  })
  .after(1000, function() {
		this.stop();
    this.clockwise(0.5);
  })
  .after(2500, function() {
    this.stop();
    this.front(0.1);
  })
  .after(1000, function() {
    this.land();
  });