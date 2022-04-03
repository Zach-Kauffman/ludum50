
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";

let player

runOnStartup(async runtime =>
{
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.
	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
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
}

function Tick(runtime)
{

}
