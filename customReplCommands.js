// customReplCommands.js

/*
	Enables you to add more functions that you can use with the repl code.
	Be able to send more commands other than the default ones
*/

var arDrone = require('ar-drone');
var client  = arDrone.createClient();

Client = require('../lib/Client');


/* 	
	If you create another function in the format "Client.prototype.[functionName]"
	Now when you run this script, you can type in [functionName] and it will
	run the code that you defined below.
 */
Client.prototype.testMovement = function() {
	client.takeoff();

	client.after(4000, function() {
    	client.animate('turnaround', 6000);
    	console.log('turn around?');
	})

	.after(6000, function() {
		console.log('landing!');
		this.stop();
		this.land();
	});

	return true;
}

client.createRepl();
