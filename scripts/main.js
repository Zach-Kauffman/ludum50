
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";

let player
let wave
let timeSinceStart

let lowtide = true
let hightide = false

const direction = [0, 1, 2, 3]
let dirChoice = 0

runOnStartup(async runtime =>
{
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.
	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
	
	timeSinceStart = 0
});

async function OnBeforeProjectStart(runtime)
{
	// Code to run just before 'On start of layout' on
	// the first layout. Loading has finished and initial
	// instances are created and available to use here.
	
	runtime.addEventListener("tick", () => Tick(runtime));
	
	player = runtime.objects.Player.getFirstInstance()
	
	player.y = 160
	player.x = 160
	
	wave = runtime.objects.Wave.getAllInstances()
	wave.forEach((w, i) => {
		w.x = i * 16
		w.y = -120
	});
}

function Tick(runtime)
{
	const dt = runtime.dt;
	timeSinceStart += dt
	
	Wave(timeSinceStart, direction[dirChoice])

	// Since we use sin() to do the waves, they will do a full cycle each time our timer reaches Pi
	// This increments which direction the waves come from each time Pi is reached
	// This also toggles low/high tides
	if(timeSinceStart > Math.PI) {
		timeSinceStart = 0
		dirChoice += 1
		if(dirChoice == 4) {
			dirChoice = 0
			lowtide = !lowtide
			hightide = !hightide
		}
	}
}

function Wave(time, direction) {
	const magnitude = hightide ? 0.5 : 2.0
	wave.forEach((w, i) => {
		// Top
		if(direction == 0) {
			w.x = 8 + i * 16
			w.y = -120 + (magnitude * 60 * Math.sin(time))
		}
		
		// Bottom
		else if (direction == 2) {
			w.x = 8 + i * 16
			w.y = 440 - (magnitude * 60 * Math.sin(time))
		}
		
		// Right
		else if (direction == 1) {
			w.x = i * 16 + 440 - (magnitude * 60 * Math.sin(time))
			w.y = 160
		}
		
		// Left
		else if (direction == 3) {
			w.x = i * 16 - 160 + (magnitude * 60 * Math.sin(time))
			w.y = 160
		}
	});
	
}