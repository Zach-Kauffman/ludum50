
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";

let player
let wave
let timeSinceStart

let lowtide = false
let hightide = false

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
	
	wave = runtime.objects.Wave.getFirstInstance()
	wave.x = 160
	wave.y = 640
}

function Tick(runtime)
{
	const dt = runtime.dt;
	timeSinceStart += dt
	Wave(timeSinceStart, Math.floor(Math.random() * 4))
}

function Wave(time, direction) {
	console.log(direction)
	if(direction == 0) {
		wave.x = 0
		wave.y = 560 - (60 * Math.sin(time))
	}
	else if (direction == 1) {
		wave.x = 0
		wave.y = -240 + (60 * Math.sin(time))
	}
	else if (direction == 2) {
		wave.x = 560 - (60 * Math.sin(time))
		wave.y = 0
	}
	else if (direction == 3) {
		wave.x = -240 + (60 * Math.sin(time))
		wave.y = 0
	}

}