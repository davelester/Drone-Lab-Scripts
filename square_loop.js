/*
Supplies access to nav data
* Flies the quadcopter within a range of 1 to 2 meters. Correct its altitude
  if it moves outside of that range.
* Flies in a square 5 times

Sample Data for reference:
{ header: 1432778632,
  droneState: 
   { flying: 0,
     videoEnabled: 0,
     visionEnabled: 1,
     controlAlgorithm: 0,
     altitudeControlAlgorithm: 1,
     startButtonState: 0,
     controlCommandAck: 1,
     cameraReady: 1,
     travellingEnabled: 0,
     usbReady: 0,
     navdataDemo: 1,
     navdataBootstrap: 0,
     motorProblem: 0,
     communicationLost: 0,
     softwareFault: 0,
     lowBattery: 1,
     userEmergencyLanding: 0,
     timerElapsed: 0,
     MagnometerNeedsCalibration: 0,
     anglesOutOfRange: 0,
     tooMuchWind: 0,
     ultrasonicSensorDeaf: 0,
     cutoutDetected: 0,
     picVersionNumberOk: 1,
     atCodecThreadOn: 1,
     navdataThreadOn: 1,
     videoThreadOn: 1,
     acquisitionThreadOn: 1,
     controlWatchdogDelay: 0,
     adcWatchdogDelay: 0,
     comWatchdogProblem: 0,
     emergencyLanding: 0 },
  sequenceNumber: 4661,
  visionFlag: 1,
  demo: 
   { controlState: 'CTRL_LANDED',
     flyState: 'FLYING_OK',
     batteryPercentage: 15,
     rotation: 
      { frontBack: 0.887,
        pitch: 0.887,
        theta: 0.887,
        y: 0.887,
        leftRight: -0.072,
        roll: -0.072,
        phi: -0.072,
        x: -0.072,
        clockwise: 52.492,
        yaw: 52.492,
        psi: 52.492,
        z: 52.492 },
     frontBackDegrees: 0.887,
     leftRightDegrees: -0.072,
     clockwiseDegrees: 52.492,
     altitude: 0,
     altitudeMeters: 0,
     velocity: { x: 0, y: 0, z: 0 },
     xVelocity: 0,
     yVelocity: 0,
     zVelocity: 0,
     frameIndex: 0,
     detection: { camera: [Object], tagIndex: 0 },
     drone: { camera: [Object] } },
  visionDetect: 
   { nbDetected: 0,
     type: [ 0, 0, 0, 0 ],
     xc: [ 0, 0, 0, 0 ],
     yc: [ 0, 0, 0, 0 ],
     width: [ 0, 0, 0, 0 ],
     height: [ 0, 0, 0, 0 ],
     dist: [ 0, 0, 0, 0 ],
     orientationAngle: [ 0, 0, 0, 0 ],
     rotation: [ [Object], [Object], [Object], [Object] ],
     translation: [ [Object], [Object], [Object], [Object] ],
     cameraSource: [ 0, 0, 0, 0 ] } }
*/

var data, counter;
var displayPage = [];
var arDrone = require('ar-drone');
var drone = arDrone.createClient();
var animations = [
  // 'phiM30Deg', 'phi30Deg', 'thetaM30Deg', 'theta30Deg', 'theta20degYaw200deg',
  // 'theta20degYawM200deg', 'turnaround', 'turnaroundGodown', 
  // 'yawShake', 'yawDance', 'phiDance', 'thetaDance', 'vzDance',
  'wave', 'phiThetaMixed',
  // 'doublePhiThetaMixed', 'flipAhead', 'flipBehind', 'flipLeft', 'flipRight'
];
//pushing new lines the size of my terminal. This way, each item is on its own line
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
//counter for how many times it does the square
counter = 0;
//need a second counter for the while loop. Otherwise some safety kicks in and 
//wont launch an infinite 'while'. Trying to have the counter trigger the while
//is also considered an infitire 'while' aparently. 
var i = 0;
displayPage[28] = 'stop';
while(i < 11){
  drone
    .after(2000, function() { 
      displayPage[15] = "counter: " + counter;
      displayPage[28] = 'front';
      drone.front(0.1);
    })
    .after(2000,function(){
      drone.stop();
      displayPage[28] = 'right';
      drone.right(0.1);
    })
    .after(2000,function(){
      drone.stop();
      displayPage[28] = 'back';
      drone.back(0.1);
    })
    .after(2000,function(){
      drone.stop();
      displayPage[28] = 'left';
      drone.left(0.1);
    })
    .after(2000,function(){
      drone.stop();
      displayPage[28] = 'stop';
    })
    .after(2000, function() {
      counter++;
      if(counter > 5){
        this.stop();
        this.land();
      }
    });
    i++;
}