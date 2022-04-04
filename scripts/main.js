
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";

let player;
let waves = [];
let mainWave;
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
	
	mainWave = runtime.objects.MainWaveR.getFirstInstance();
	mainWave.x = 440;
	mainWave.y = 160;
	
	wall = runtime.objects.Wall.getFirstInstance();
	wall.x = 264;
	wall.y = 264;
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
			console.log(hightide ? "It's low tide" : "It's high tide");
		}
	}
}

function Wave(time, direction) {
	const magnitude = hightide ? 1.0 : 1.0;
	const delta = (magnitude * 60 * Math.sin(time));
	mainWave.x = 440 - delta;
	waves.forEach((waveList, i) => {
		waveList.forEach((w, j) => {
			const distanceToWall = WillCollideWithWall(w, delta, i);
			if (distanceToWall > 0) {
// 				switch(i) {
// 					case 0: 
// 						w.y += distanceToWall;
// 						break;
// 					case 1: 
// 						w.x -= distanceToWall;
// 						break;
// 					case 2: 
// 						w.y -= distanceToWall;
// 						break;
// 					case 3: 
// 						w.x += distanceToWall;
// 						break;	
// 				}
			}
			
			else {
				switch(i) {
					case 0: 
						w.y = -120 + delta;
						break;
					case 1: 
						w.x = 440 - delta;
						break;
					case 2: 
						w.y = 440 - delta;
						break;
					case 3: 
						w.x = -120 + delta;
						break;	
				}
			}
			
		});
	});	
}

function WillCollideWithWall(wave, delta, direction) {
	const currentX = wave.x;
	const currentY = wave.y;
	
	let nextCoord;
	let upcomingMoveDistance;
	let distanceToWall;
	
	switch(direction) {
		case 0:
			if(currentX == wall.x) {
				nextCoord = -120 + delta;
				upcomingMoveDistance = Math.abs(currentY - nextCoord);
				distanceToWall = Math.abs(currentY + 128 - wall.y);
				if(upcomingMoveDistance >= distanceToWall) {
					console.log("top collision!");
					return distanceToWall;
				}
			}
			break;
		case 1:
			if (currentY == wall.y) {
				nextCoord = 440 - delta;
				upcomingMoveDistance = Math.abs(currentX - nextCoord);
				distanceToWall = Math.abs(currentX - 128 - wall.x);
				if(upcomingMoveDistance >= distanceToWall) {
					console.log("right collision!");
					return distanceToWall;
				}
			}
			break;
		case 2:
			if(currentX == wall.x) {
				nextCoord = 440 - delta;
				upcomingMoveDistance = Math.abs(currentY - nextCoord);
				distanceToWall = Math.abs(currentY - 128 - wall.y);
				if(upcomingMoveDistance >= distanceToWall) {
					console.log("bottom collision!");
					return distanceToWall;
				}
			}
			break;
		case 3:
			if(currentY == wall.y) {
				nextCoord = -120 + delta;
				upcomingMoveDistance = Math.abs(currentX - nextCoord);
				distanceToWall = Math.abs(currentX + 128 - wall.x);
				if(upcomingMoveDistance >= distanceToWall) {
					console.log("left collision!");
					return distanceToWall;
				}
			}
			break;
	}
	
	return -1;
}
