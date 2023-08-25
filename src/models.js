
export const SERIES_SPECS = [
	{
		// Includes all Actions / Variabels / Feedbacks
		id: "Panapod",
		variables: {
			version: false, // If a camera sends a package every minute with the firmware version (qSV3)
			error: true, // Camera can return Error messages when actions fail (rER)
			ins: false, // Install position (iNS0 or iNS1)
			power: false, // Power State (p1 or p0)
			tally: false, // Tally State (TLR:1 or TLR:0)
			OAF: false, // Has Auto Focus (OAF:1 or OAF:0)
			iris: false, // Has Auto Iris (d30 or d31)
			gainValue: false,
			preset: false,
		},
		feedbacks: {
			powerState: false, // Power State (p1 or p0)
			tallyState: false, // Tally State (TLR:1 or TLR:0)
			insState: false, // Install position (iNS0 or iNS1)
			autoFocus: false, // Has Auto Focus (OAF:1 or OAF:0)
			autoIris: false, // Has Auto Iris (d30 or d31)
			preset: false,
		},
		actions: {
			panTilt: true, // Has Pan/Tilt Support (PTSxx)
			ptSpeed: true, // Internal Speed Options
			zoom: false, // Has Zoom Support (Zxx)
			zSpeed: false, // Internal Speed Options
			focus: false, // Has Focus Support (Fxx)
			fSpeed: false, // Internal Speed Options
			OAF: false, // Has Auto Focus Support (D10 or D11)
			OTAF: false, // Has One Touch Auto Focus Support (OSE:69:1)
			iris: false, // Has Iris Support (manual and auto) (Ixx)
			gain: false, // Has Gain Support
			shut: false, // Has Shutter Support
			ped: false, // Has Pedistal Support
			filter: false, // Has ND Filter Support
			preset: true, // Can Save and Recall Presets (Mxxx or Rxxx)
			speedPset: false, // Has Preset Recall Speed Control (UPVSxx)
			timePset: false, // Has Preset Recall Time Control (UPVSxx or OSJ:29:xx)
			power: false, // Has Power Control (O0 or O1)
			tally: false, // Has Red Tally Light Control (DA1 or DA0)
			ins: false, // Has Install Position Control (INSx)
			sdCard: false, // Has SD Card Recording Control (sdctrl?save=start or sdctrl?save=end)
		},
	},
];
