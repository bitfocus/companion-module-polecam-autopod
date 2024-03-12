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

const CHOICES_ON_OFF = [
	{ id: '0', label: 'Off' },
	{ id: '1', label: 'On' },
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

export async function sendPanTilt(self) {
	const pan = 50 + self.panning * parseInt(self.ptSpeed)
	const tilt = 50 + self.tilting * parseInt(self.ptSpeed)

	const str = 'PTS' + ('00' + pan).substr(-2) + ('00' + tilt).substr(-2)

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
			name: 'Up',
			options: [],
			callback: async (action) => {
				self.tilting = 1
				await sendPanTilt(self)
			},
		}

		actions.down = {
			name: 'Down',
			options: [],
			callback: async (action) => {
				self.tilting = -1
				await sendPanTilt(self)
			},
		}

		actions.left = {
			name: 'Left',
			options: [],
			callback: async (action) => {
				self.panning = 1
				await sendPanTilt(self)
			},
		}

		actions.right = {
			name: 'Right',
			options: [],
			callback: async (action) => {
				self.panning = -1
				await sendPanTilt(self)
			},
		}

		actions.stopud = {
			name: 'Stop Up/Down',
			options: [],
			callback: async (action) => {
				self.tilting = 0
				await sendPanTilt(self)
			},
		}

		actions.stoplr = {
			name: 'Stop Left/Right',
			options: [],
			callback: async (action) => {
				self.panning = 0
				await sendPanTilt(self)
			},
		}

		actions.home = {
			name: 'Up/Down/Left/Right - Home',
			options: [],
			callback: async (action) => {
				await sendPTZ(self, 'APC7FFF7FFF')
			},
		}
	}

	if (seriesActions.ptSpeed) {
		actions.ptSpeedS = {
			name: 'Up/Down/Left/Right - Speed',
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
				self.setVariableValues({ ptSpeed: self.ptSpeed })
			},
		}
	}

	if (seriesActions.ptSpeed) {
		actions.ptSpeedU = {
			name: 'Up/Down/Left/Right - Speed Up',
			options: [],
			callback: async (action) => {
				if (self.ptSpeedIndex == 0) {
					self.ptSpeedIndex = 0
				} else if (self.ptSpeedIndex > 0) {
					self.ptSpeedIndex--
				}
				self.ptSpeed = c.CHOICES_SPEED[self.ptSpeedIndex].id
				self.setVariableValues({ ptSpeed: self.ptSpeed })
			},
		}
	}

	if (seriesActions.ptSpeed) {
		actions.ptSpeedD = {
			name: 'Up/Down/Left/Right - Speed Down',
			options: [],
			callback: async (action) => {
				if (self.ptSpeedIndex == c.CHOICES_SPEED.length) {
					self.ptSpeedIndex = c.CHOICES_SPEED.length
				} else if (self.ptSpeedIndex < c.CHOICES_SPEED.length) {
					self.ptSpeedIndex++
				}
				self.ptSpeed = c.CHOICES_SPEED[self.ptSpeedIndex].id
				self.setVariableValues({ ptSpeed: self.ptSpeed })
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

	actions.splitDualLeg = {
		name: 'Split Dual Leg',
		options: [],
		callback: async (action) => {
			await sendPTZ(self, 'R10')
		},
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

	actions.dualLegPancake = {
		name: 'Dual Leg + pancake',
		options: [],
		callback: async (action) => {
			await sendPTZ(self, 'R16')
		},
	}

	actions.autoCalibrate = {
		name: 'Set autocalibration',
		options: [
			{
				type: 'dropdown',
				label: 'Auto calibration',
				id: 'val',
				default: CHOICES_ON_OFF[0].id,
				choices: CHOICES_ON_OFF,
			},
		],
		callback: async (action) => {
			if (action.options.val === '1') {
				await sendPTZ(self, 'D11')
				await self.getAutoCalibrate()
			} else {
				await sendPTZ(self, 'D10')
				await self.getAutoCalibrate()
			}
		},
	}

	actions.demoMode = {
		name: 'Start Demo Mode',
		options: [],
		callback: async (action) => {
			await sendPTZ(self, 'R14')
		},
	}

	actions.stopDemoMode = {
		name: 'Stop Demo Mode',
		options: [],
		callback: async (action) => {
			await sendPTZ(self, 'R15')
		},
	}

	actions.calib = {
		name: 'Perform calibration',
		options: [],
		callback: async (action) => {
			await sendPTZ(self, 'R18')
		},
	}

	actions.reboot = {
		name: 'Reboot device',
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
			let val = 0x555 + Math.round((0xaaa / 100) * parseInt(action.options.val, 10))
			if (val >= 4096) {
				val = 4095
			}
			if (val < 0x555) {
				val = 0x555
			}

			await sendPTZ(self, 'AXI' + val.toString(16).toUpperCase())
			self.getPresetSpeed()
		},
	}

	return actions
}
