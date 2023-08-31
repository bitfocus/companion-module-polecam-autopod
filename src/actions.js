/* eslint-disable no-unused-vars */
import { c } from './choices.js'
import { getAndUpdateSeries } from './common.js'
import got from 'got'

// ########################
// #### Value Look Ups ####
// ########################
const CHOICES_IRIS = []
for (let i = 0; i < 100; ++i) {
	CHOICES_IRIS.push({
		id: ('0' + i.toString(10)).substr(-2, 2),
		label: 'Iris ' + i,
	})
}

const CHOICES_PRESET = []
for (let i = 0; i < 10; ++i) {
	CHOICES_PRESET.push({
		id: ('0' + i.toString(10)).substr(-2, 2),
		label: 'Preset ' + (i + 1),
	})
}

const CHOICES_SPEED = []
for (let i = 0; i < 100; ++i) {
	CHOICES_SPEED.push({ id: i.toString(10), label: i + '% Speed' })
}

const CHOICES_SHOW_MODE = [
	{ id: '0', label: 'Stop show mode', value: '15' },
	{
		id: '1',
		label: 'Show Mode. 1/3 speed. 30 sec wait at top & bottom',
		value: '14',
	},
	{
		id: '2',
		label: 'Show Mode. 1/3 speed. 45 sec wait at top & bottom',
		value: '16',
	},
	{
		id: '3',
		label: 'Show Mode. 1/3 speed. 60 sec wait at top & bottom',
		value: '17',
	},
]

// ######################
// #### Send Actions ####
// ######################

export async function sendPTZ(self, str) {
	if (str) {
		const url = `http://${self.config.host}:${self.config.httpPort}/cgi-bin/aw_ptz?cmd=%23${str}&res=1`
		if (self.config.debug) {
			self.log('debug', `Sending : ${url}`)
		}

		try {
			await got.get(url)
		} catch (err) {
			throw new Error(`Action failed: ${url}`)
		}
	}
}

// ##########################
// #### Instance Actions ####
// ##########################
export function getActionDefinitions(self) {
	const actions = {}

	const SERIES = getAndUpdateSeries(self)

	const seriesActions = SERIES.actions

	// ##########################
	// #### Up/Down Actions ####
	// ##########################

	if (seriesActions.panTilt) {
		actions.up = {
			name: 'Up/Down - Up',
			options: [],
			callback: async (action) => {
				await sendPTZ(self, 'PTS50' + parseInt(50 + self.ptSpeed))
			},
		}

		actions.down = {
			name: 'Up/Down - Down',
			options: [],
			callback: async (action) => {
				const n = parseInt(50 - self.ptSpeed)
				const string = '' + (n < 10 ? '0' + n : n)
				await sendPTZ(self, 'PTS50' + string)
			},
		}

		actions.stop = {
			name: 'Up/Down - Stop',
			options: [],
			callback: async (action) => {
				await sendPTZ(self, 'PTS5050')
			},
		}

		actions.home = {
			name: 'Up/Down - Home',
			options: [],
			callback: async (action) => {
				await sendPTZ(self, 'APC7FFF7FFF')
			},
		}
	}

	if (seriesActions.ptSpeed) {
		actions.ptSpeedS = {
			name: 'Up/Down - Speed',
			options: [
				{
					type: 'dropdown',
					label: 'speed setting',
					id: 'speed',
					default: 25,
					choices: c.CHOICES_SPEED,
				},
			],
			callback: async (action) => {
				self.ptSpeed = action.options.speed

				const idx = c.CHOICES_SPEED.findIndex((sp) => sp.id === self.ptSpeed)
				if (idx > -1) {
					self.ptSpeedIndex = idx
				}

				self.ptSpeed = c.CHOICES_SPEED[self.ptSpeedIndex].id
				self.setVariableValues({ ptSpeedVar: self.ptSpeed })
			},
		}
	}

	if (seriesActions.ptSpeed) {
		actions.ptSpeedU = {
			name: 'Up/Down - Speed Up',
			options: [],
			callback: async (action) => {
				if (self.ptSpeedIndex == 0) {
					self.ptSpeedIndex = 0
				} else if (self.ptSpeedIndex > 0) {
					self.ptSpeedIndex--
				}
				self.ptSpeed = c.CHOICES_SPEED[self.ptSpeedIndex].id
				self.setVariableValues({ ptSpeedVar: self.ptSpeed })
			},
		}
	}

	if (seriesActions.ptSpeed) {
		actions.ptSpeedD = {
			name: 'Up/Down - Speed Down',
			options: [],
			callback: async (action) => {
				if (self.ptSpeedIndex == c.CHOICES_SPEED.length) {
					self.ptSpeedIndex = c.CHOICES_SPEED.length
				} else if (self.ptSpeedIndex < c.CHOICES_SPEED.length) {
					self.ptSpeedIndex++
				}
				self.ptSpeed = c.CHOICES_SPEED[self.ptSpeedIndex].id
				self.setVariableValues({ ptSpeedVar: self.ptSpeed })
			},
		}
	}

	// #########################
	// #### Presets Actions ####
	// #########################

	if (seriesActions.preset) {
		actions.savePset = {
			name: 'Preset - Save',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: 'val',
					default: CHOICES_PRESET[0].id,
					choices: CHOICES_PRESET,
				},
			],
			callback: async (action) => {
				await sendPTZ(self, 'M' + action.options.val)
			},
		}

		actions.recallPset = {
			name: 'Preset - Recall',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: 'val',
					default: CHOICES_PRESET[0].id,
					choices: CHOICES_PRESET,
				},
			],
			callback: async (action) => {
				await sendPTZ(self, 'R' + action.options.val)
			},
		}
	}

	actions.singleLeg = {
		name: 'Single Leg',
		options: [],
		callback: async (action) => {
			await sendPTZ(self, 'R11')
		},
	}

	actions.dualLeg = {
		name: 'Dual Leg',
		options: [],
		callback: async (action) => {
			await sendPTZ(self, 'R12')
		},
	}

	actions.showMode = {
		name: 'Show Mode',
		options: [
			{
				type: 'dropdown',
				label: 'Show Mode',
				id: 'val',
				default: CHOICES_SHOW_MODE[0].id,
				choices: CHOICES_SHOW_MODE,
			},
		],
		callback: async (action) => {
			const val = CHOICES_SHOW_MODE.find((choice) => choice.id === action.options.val)
			if (val) {
				await sendPTZ(self, 'R' + val)
			}
		},
	}

	actions.calib = {
		name: 'Perform calibration',
		options: [],
		callback: async (action) => {
			await sendPTZ(self, 'R18')
		},
	}

	actions.stowLegs = {
		name: 'Perform calibration',
		options: [],
		callback: async (action) => {
			await sendPTZ(self, 'R19')
		},
	}

	actions.recallSpeed = {
		name: 'Recall Speed',
		options: [
			{
				type: 'dropdown',
				label: 'Speed setting',
				id: 'val',
				default: CHOICES_SPEED[0].id,
				choices: CHOICES_SPEED,
			},
		],
		callback: async (action) => {
			let val = Math.round((4096 / 100) * parseInt(action.options.val, 10))
			if (val === 4096) {
				val = 4095
			}

			await sendPTZ(self, 'AXI' + ('00' + val.toString(16)).substr(-3).toUpperCase())
		},
	}

	return actions
}
