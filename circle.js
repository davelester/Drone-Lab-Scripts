/*
* Supplies access to nav data
* Flies the quadcopter within a range of 1 to 2 meters. Correct its altitude
if it moves outside of that range.
* flies in a squarish circle similar to QQZ code. Does a wave after. 
*/

var data, counter,i;
var displayPage = [];
var arDrone = require('ar-drone');
var drone = arDrone.createClient();
var animations = [
  'phiM30Deg', 'phi30Deg', 'thetaM30Deg', 'theta30Deg', 'theta20degYaw200deg',
  'theta20degYawM200deg', 'turnaround', 'turnaroundGodown', 
  'yawShake', 'yawDance', 'phiDance', 'thetaDance', 'vzDance',
  'wave', 'phiThetaMixed',
  'doublePhiThetaMixed', 'flipAhead', 'flipBehind', 'flipLeft', 'flipRight'
];

for(var i = 0; i < 35; i++){
  displayPage.push('\n');
}
displayPage[34] = 'Animation: None';

drone.config('general:navdata_demo', 'TRUE');
drone.on('navdata', function(navdata) {
  data = navdata;
  if (!navdata.demo) {
    console.log('Fail...')
    return; 
  }
  
  if (navdata.droneState.lowBattery) {
    displayPage[30] = 'DEAD BATTERY  :(';
  }
  else{
    displayPage[30] = 'Battery: ' + navdata.demo.batteryPercentage;
  }

  if (navdata.demo.altitudeMeters > 2) {
    displayPage[32] = 'maxed out, going down ' + navdata.demo.altitudeMeters;
    drone.down(0.5);
    drone.after(500, function() {
      drone.stop();
    });
  } 
  else if (navdata.demo.altitudeMeters < 1) {
    displayPage[32] = 'going up ' + navdata.demo.altitudeMeters;
    drone.up(0.5);
    drone.after(500, function() {
      drone.stop();
    });     
  } 
  else {
    displayPage[32] = 'level: ' + navdata.demo.altitudeMeters;
  }

  displayPage.forEach(function(text){
    console.log(text);
  });
});

drone.takeoff();
//requires two counters, one for while loop and one to determine when to land.
counter = 0;
i = 0;

displayPage[28] = 'stop';
while(i < 100){
  drone
    .after(2000, function() { 
      displayPage[15] = "counter: " + counter;
      displayPage[28] = 'front';
      drone.front(0.1);
    })
    .after(1000,function(){
      drone.stop();
      displayPage[28] = 'turn';
      drone.clockwise(0.5);
    })
    .after(2500,function(){
      drone.stop();
      displayPage[28] = 'right';
      drone.front(0.1);
    })
    .after(1000,function(){
      drone.stop();
      displayPage[28] = 'turn';
      drone.clockwise(0.5);
    })
    .after(2500,function(){
      drone.stop();
      displayPage[28] = 'back';
      drone.front(0.1);
    })
    .after(1000,function(){
      drone.stop();
      displayPage[28] = 'turn';
      drone.clockwise(0.5);
    })
    .after(2500,function(){
      drone.stop();
      displayPage[28] = 'left';
      drone.front(0.1);
    })
    .after(1000,function(){
      drone.stop();
      displayPage[28] = 'turn';
      drone.clockwise(0.5);
    })
    .after(2500, function() {
      this.stop();
      drone.animate(animations[13],2000);
      counter++;
      if(counter > 1){
        drone.land();  
      }
    });
    i++;
}