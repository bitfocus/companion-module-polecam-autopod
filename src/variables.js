// ##########################
// #### Define Variables ####
// ##########################
export function setVariables() {
	const variables = []

	variables.push({ variableId: 'series', name: 'Camera Series' })
	variables.push({ variableId: 'model', name: 'Model of camera' })
	variables.push({ variableId: 'name', name: 'Name of camera' })
	variables.push({ variableId: 'ptSpeed', name: 'Up/Down/Left/Right Speed' })
	variables.push({ variableId: 'recallSpeed', name: 'Preset recall Speed' })
	variables.push({ variableId: 'firmware', name: 'Firmware name and version' })
	variables.push({ variableId: 'calibration', name: 'Calibration status' })
	variables.push({ variableId: 'panposition', name: 'Pan position' })
	variables.push({ variableId: 'tiltposition', name: 'Tilt position' })
	variables.push({ variableId: 'autocalibrate', name: 'Autocalibration status' })

	return variables
}

// #########################
// #### Check Variables ####
// #########################
export function checkVariables(self) {
	self.setVariableValues({
		series: self.data.series,
		model: self.data.model,
		name: self.data.name,
		error: self.data.error,
		ptSpeed: self.ptSpeed,
		recallSpeed: self.data.recallSpeed,
		firmware: self.data.firmware,
		calibration: {
			uncalibrated: 'Uncalibrated!',
			calibrating: 'Calibrating...',
			calibrated: 'Calibrated',
			motor_error: 'Error!',
			'N/A': 'N/A',
		}[self.data.calibration],
		panposition: self.data.panposition,
		tiltposition: self.data.tiltposition,
		autocalibrate: self.data.autocalibrate ? 'On' : 'Off',
	})
}
