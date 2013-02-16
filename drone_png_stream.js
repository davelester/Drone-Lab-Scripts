var arDrone = require('ar-drone');
var drone  = arDrone.createClient();

require('ar-drone-png-stream')(drone, { port: 8000 });

drone.takeoff();

drone
  .after(10000, function() {
    this.stop();
    this.land();
  });