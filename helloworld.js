var arDrone = require('ar-drone');
var drone  = arDrone.createClient();

drone.takeoff();

drone
  .after(5000, function() {
    drone.animate('wave', 3000);
  })
  .after(10000, function() {
    this.stop();
    this.land();
  });