// ##########################
// #### Define Variables ####
// ##########################
export function setVariables() {
	const variables = []

	variables.push({ variableId: 'series', name: 'Camera Series' })
	variables.push({ variableId: 'model', name: 'Model of camera' })
	variables.push({ variableId: 'name', name: 'Name of camera' })
	variables.push({ variableId: 'ptSpeedVar', name: 'Up/Down Speed' })

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
		ptSpeedVar: self.ptSpeed,
	})
}
