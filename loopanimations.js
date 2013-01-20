var arDrone = require('ar-drone');
var client = arDrone.createClient();
client.config('general:navdata_demo', 'TRUE');
client.takeoff();

/*
Fly the quadcopter within a range of 1 to 3 meters. Correct its altitude
if it moves outside of that range.
*/
client.on('navdata', function(navdata) {
	if (!navdata.demo) {return; }
	if (navdata.demo.altitudeMeters > 3) {
		console.log('maxed out, going down', navdata.demo.altitudeMeters);
		client.down(0.5);
		client.after(1000, function() {
			client.stop();
		});
	} else if (navdata.demo.altitudeMeters < 1) {
			console.log('going up', navdata.demo.altitudeMeters);
			client.up(0.5);
			client.after(1000, function() {
				client.stop();
			});			
	} else {
		client.up(0.5);
		client.after(1000, function() {
			client.stop();
		});					
	}
	// console.log(navdata);
});

/*
After two seconds, loop through all the animations (some of these rock)
*/
client.after(2000, function() {
		// this.up(0.4);
		
		// client.after(3000, function() { client.stop(); });

		var animations = [
			'phiM30Deg', 'phi30Deg', 'thetaM30Deg', 'theta30Deg', 'theta20degYaw200deg',
			'theta20degYawM200deg', 'turnaround', 'turnaroundGodown', 
			'yawShake', 'yawDance', 'phiDance', 'thetaDance', 'vzDance', 
			'wave', 'phiThetaMixed',
			'doublePhiThetaMixed', 'flipAhead', 'flipBehind', 'flipLeft', 'flipRight'
			];
			animations.forEach(function(anim) {
				client.after(3000, function() {
						console.log(anim);
						client.animate(anim, 2000);
			  });
			});		

	client.after(3000, function() {
	    this.stop();
	    this.land();
	  });
 });