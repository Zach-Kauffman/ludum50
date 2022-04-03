
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";

let player;
let waves = [];
let wall;

let timeSinceStart;

let lowtide = true;
let hightide = false;

const direction = [0, 1, 2, 3];
let dirChoice = 0;

runOnStartup(async runtime =>
{
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.
	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
	
	timeSinceStart = 0;
});

async function OnBeforeProjectStart(runtime)
{
	// Code to run just before 'On start of layout' on
	// the first layout. Loading has finished and initial
	// instances are created and available to use here.
	
	runtime.addEventListener("tick", () => Tick(runtime));
	
	player = runtime.objects.Player.getFirstInstance();
	
	player.y = 160;
	player.x = 160;
	
	// Init wave position to perimiter of screen
	// waves are indexed as follows:
	// Top: 	0
	// Right: 	1
	// Bottom: 	2
	// Left: 	3
	waves.push(runtime.objects.WaveT.getAllInstances());
	waves.push(runtime.objects.WaveR.getAllInstances());
	waves.push(runtime.objects.WaveB.getAllInstances());
	waves.push(runtime.objects.WaveL.getAllInstances());
	waves.forEach((waveList, i) => {
		waveList.forEach((w, j) => {
			switch(i) {
				case 0: 
					w.x = j * 16 + 8;
					w.y = -120;
					break;
				case 1: 
					w.x = 440;
					w.y = j * 16 + 8;
					break;
				case 2: 
					w.x = j * 16 + 8;
					w.y = 440;
					break;
				case 3: 
					w.x = -120;
					w.y = j * 16 + 8;
					break;
			}
		});
	});
	
	wall = runtime.objects.Player.getFirstInstance();
	wall.x = 168;
	wall.y = 184;
}

function Tick(runtime)
{
	const dt = runtime.dt;
	timeSinceStart += dt;
	
	Wave(timeSinceStart, direction[dirChoice]);

	// Since we use sin() to do the waves, they will do a full cycle each time our timer reaches Pi
	// This increments which direction the waves come from each time Pi is reached
	// This also toggles low/high tides
	if(timeSinceStart > Math.PI) {
		timeSinceStart = 0;
		dirChoice += 1;
		if(dirChoice == 4) {
			dirChoice = 0;
			lowtide = !lowtide;
			hightide = !hightide;
		}
	}
}

function Wave(time, direction) {
	const magnitude = hightide ? 1.0 : 2.5;
	
	waves.forEach((waveList, i) => {
		waveList.forEach((w, j) => {
			CheckForWall(w, time, i, magnitude);
			switch(i) {
				case 0: 
					w.y = -120 + (magnitude * 60 * Math.sin(time));
					break;
				case 1: 
					w.x = 440 - (magnitude * 60 * Math.sin(time));
					break;
				case 2: 
					w.y = 440 - (magnitude * 60 * Math.sin(time));
					break;
				case 3: 
					w.x = -120 + (magnitude * 60 * Math.sin(time));
					break;	
			}
		});
	});	
}

function CheckForWall(wave, time, direction, magnitude) {
	const currentX = wave.x;
	const currentY = wave.y;
	const delta = (magnitude * 60 * Math.sin(time));
	
	switch(direction) {
		case 0:
			if((currentY + delta) >= wall.y) {
				console.log("top collision!");
			}
			break;
		case 1:
			if((currentX - delta) <= wall.x) {
				console.log("right collision!");
			}
			break;
		case 2:
			if((currentY - delta) <= wall.y) {
				console.log("bottom collision!");
			}
			break;
		case 3:
			if((currentX + delta) >= wall.x) {
				console.log("left collision!");
			}
			break;
	}
}
