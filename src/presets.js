import { combineRgb } from '@companion-module/base'
import { getAndUpdateSeries, ICONS } from './common.js'

export function getPresetDefinitions(self) {
	// @type {{[key: string]: CompanionButtonPresetDefinition}}
	const presets = {}

	const foregroundColor = combineRgb(255, 255, 255) // White
	const backgroundColor = combineRgb(0, 0, 0) // Black

	const SERIES = getAndUpdateSeries(self)
	const seriesActions = SERIES.actions

	// ##########################
	// #### Up/Down/Left/Right Presets ####
	// ##########################

	if (seriesActions.panTilt) {
		presets['pan-tilt-up'] = {
			type: 'button',
			category: 'Up/Down/Left/Right',
			name: 'UP',
			style: {
				text: '',
				png64: ICONS.ICON_UP,
				pngalignment: 'center:center',
				size: '18',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'up',
							options: {},
						},
					],
					up: [
						{
							actionId: 'stopud',
							options: {},
						},
					],
				},
			],
			feedbacks: [],
		}

		presets['pan-tilt-down'] = {
			type: 'button',
			category: 'Up/Down/Left/Right',
			name: 'DOWN',
			style: {
				text: '',
				png64: ICONS.ICON_DOWN,
				pngalignment: 'center:center',
				size: '18',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'down',
							options: {},
						},
					],
					up: [
						{
							actionId: 'stopud',
							options: {},
						},
					],
				},
			],
			feedbacks: [],
		}

		presets['pan-tilt-left'] = {
			type: 'button',
			category: 'Up/Down/Left/Right',
			name: 'LEFT',
			style: {
				text: '',
				png64: ICONS.ICON_LEFT,
				pngalignment: 'center:center',
				size: '18',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'left',
							options: {},
						},
					],
					up: [
						{
							actionId: 'stoplr',
							options: {},
						},
					],
				},
			],
			feedbacks: [],
		}

		presets['pan-tilt-right'] = {
			type: 'button',
			category: 'Up/Down/Left/Right',
			name: 'RIGHT',
			style: {
				text: '',
				png64: ICONS.ICON_RIGHT,
				pngalignment: 'center:center',
				size: '18',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'right',
							options: {},
						},
					],
					up: [
						{
							actionId: 'stoplr',
							options: {},
						},
					],
				},
			],
			feedbacks: [],
		}

		presets['pan-tilt-home'] = {
			type: 'button',
			category: 'Up/Down/Left/Right',
			name: 'Home',
			style: {
				text: 'HOME',
				size: '18',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'home',
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	if (seriesActions.ptSpeed) {
		presets['pan-tilt-speed-up'] = {
			type: 'button',
			category: 'Up/Down/Left/Right',
			name: 'Speed Up',
			style: {
				text: 'SPEED\\nUP\\n$(autopod:ptSpeed)',
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'ptSpeedU',
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['pan-tilt-speed-down'] = {
			type: 'button',
			category: 'Up/Down/Left/Right',
			name: 'Speed Down',
			style: {
				text: 'SPEED\\nDOWN\\n$(autopod:ptSpeed)',
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'ptSpeedD',
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['pan-tilt-speed-high'] = {
			type: 'button',
			category: 'Up/Down/Left/Right',
			name: 'Speed Set High',
			style: {
				text: 'SET\\nSPEED\\nHIGH',
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'ptSpeedS',
							options: {
								speed: 40,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['pan-tilt-speed-mid'] = {
			type: 'button',
			category: 'Up/Down/Left/Right',
			name: 'Speed Set Mid',
			style: {
				text: 'SET\\nSPEED\\nMID',
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'ptSpeedS',
							options: {
								speed: 25,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['pan-tilt-speed-low'] = {
			type: 'button',
			category: 'Up/Down/Left/Right',
			name: 'Speed Set Low',
			style: {
				text: 'SET\\nSPEED\\nLOW',
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'ptSpeedS',
							options: {
								speed: 10,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	// ###########################
	// #### Load/save Presets ####
	// ###########################

	if (seriesActions.preset) {
		for (let save = 0; save < 10; save++) {
			presets[`save-preset-${save}`] = {
				type: 'button',
				category: 'Save Preset',
				name: 'Save Preset ' + parseInt(save + 1),
				style: {
					text: 'SAVE\\nPSET\\n' + parseInt(save + 1),
					size: '14',
					color: foregroundColor,
					bgcolor: backgroundColor,
				},
				steps: [
					{
						down: [
							{
								actionId: 'savePset',
								options: {
									val: ('0' + save.toString(10).toUpperCase()).substr(-2, 2),
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
		}
	}

	if (seriesActions.timePset) {
		presets['recall-preset-preset-mode-speed'] = {
			type: 'button',
			category: 'Recall Preset',
			name: 'Preset Mode Speed',
			style: {
				text: 'PRESET\\nMODE\\nSPEED',
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'modePset',
							options: {
								mode: 0,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['recall-preset-preset-mode-time'] = {
			type: 'button',
			category: 'Recall Preset',
			name: 'Preset Mode Time',
			style: {
				text: 'PRESET\\nMODE\\nTIME',
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'modePset',
							options: {
								mode: 1,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	if (seriesActions.speedPset) {
		presets['recall-preset-speed-high'] = {
			type: 'button',
			category: 'Recall Preset',
			name: 'Set Recall Speed High',
			style: {
				text: 'RECALL\\nSPEED\\nHIGH',
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'speedPset',
							options: {
								speed: 25,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['recall-preset-speed-mid'] = {
			type: 'button',
			category: 'Recall Preset',
			name: 'Set Recall Speed Mid',
			style: {
				text: 'RECALL\\nSPEED\\nMID',
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'speedPset',
							options: {
								speed: 15,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['recall-preset-speed-low'] = {
			type: 'button',
			category: 'Recall Preset',
			name: 'Set Recall Speed Low',
			style: {
				text: 'RECALL\\nSPEED\\nLOW',
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'speedPset',
							options: {
								speed: 5,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	if (seriesActions.timePset) {
		presets['recall-preset-time-high'] = {
			type: 'button',
			category: 'Recall Preset',
			name: 'Set Recall Time High',
			style: {
				text: 'RECALL\\nTIME\\n5 Sec',
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'speedPset',
							options: {
								speed: 5,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['recall-preset-time-mid'] = {
			type: 'button',
			category: 'Recall Preset',
			name: 'Set Recall Time Mid',
			style: {
				text: 'RECALL\\nTIME\\n10 Sec',
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'speedPset',
							options: {
								speed: 10,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['recall-preset-time-low'] = {
			type: 'button',
			category: 'Recall Preset',
			name: 'Set Recall Time Low',
			style: {
				text: 'RECALL\\nTIME\\n30 Sec',
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'speedPset',
							options: {
								speed: 30,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	for (let recall = 0; recall < 10; recall++) {
		presets[`recall-preset-${recall}`] = {
			type: 'button',
			category: 'Recall Preset',
			name: 'Recall Preset ' + parseInt(recall + 1),
			style: {
				text: 'Recall\\nPSET\\n' + parseInt(recall + 1),
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'recallPset',
							options: {
								val: ('0' + recall.toString(10).toUpperCase()).substr(-2, 2),
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	for (let recall = 0; recall < 10; recall++) {
		presets[`recall-speed-${recall}`] = {
			type: 'button',
			category: 'Recall Preset',
			name: 'Recall speed ' + parseInt(recall * 10) + '%',
			style: {
				text: 'Recall\\nSpeed\\n' + parseInt(recall * 10) + '%',
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'recallSpeed',
							options: {
								val: (recall * 10).toString(10),
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	presets['singleLeg'] = {
		type: 'button',
		category: 'Options/Operations',
		name: 'Single leg',
		style: {
			text: 'Single\\nLeg',
			size: '14',
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		steps: [
			{
				down: [
					{
						actionId: 'singleLeg',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['dualLeg'] = {
		type: 'button',
		category: 'Options/Operations',
		name: 'Dual leg',
		style: {
			text: 'Dual\\nLeg',
			size: '14',
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		steps: [
			{
				down: [
					{
						actionId: 'dualLeg',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['splitLeg'] = {
		type: 'button',
		category: 'Options/Operations',
		name: 'Split Dual leg',
		style: {
			text: 'Split\\nLeg',
			size: '14',
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		steps: [
			{
				down: [
					{
						actionId: 'splitDualLeg',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['dualLegPancake'] = {
		type: 'button',
		category: 'Options/Operations',
		name: 'Dual leg + pancake',
		style: {
			text: 'Dual leg + pancake',
			size: '14',
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		steps: [
			{
				down: [
					{
						actionId: 'dualLegPancake',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['demoMode'] = {
		type: 'button',
		category: 'Options/Operations',
		name: 'Start demo mode',
		style: {
			text: 'Start demo mode',
			size: 'auto',
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		steps: [
			{
				down: [
					{
						actionId: 'demoMode',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['stopDemoMode'] = {
		type: 'button',
		category: 'Options/Operations',
		name: 'Stop demo mode',
		style: {
			text: 'Stop demo mode',
			size: 'auto',
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		steps: [
			{
				down: [
					{
						actionId: 'stopDemoMode',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['calib'] = {
		type: 'button',
		category: 'Options/Operations',
		name: 'Perform calibration',
		style: {
			text: 'Calibrate',
			size: '13',
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		steps: [
			{
				down: [
					{
						actionId: 'calib',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['calibfeedback'] = {
		type: 'button',
		category: 'Options/Operations',
		name: 'Perform calibration (With button feedback)',
		style: {
			text: '$(autopod:calibration)',
			size: 'auto',
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		steps: [
			{
				down: [
					{
						actionId: 'calib',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'calibrationstatus',
				options: {
					calibrated: combineRgb(0, 255, 0),
					calibrated_text: combineRgb(0, 0, 0),
					calibrating: combineRgb(255, 255, 0),
					calibrating_text: combineRgb(0, 0, 0),
					uncalibrated: combineRgb(255, 0, 0),
					uncalibrated_text: combineRgb(0, 0, 0),
					motor_error: combineRgb(128, 0, 0),
					error_text: combineRgb(0, 0, 0),
				},
			},
		],
	}

	presets['autocal'] = {
		type: 'button',
		category: 'Options/Operations',
		name: 'Autocalibrate',
		style: {
			text: 'Auto calibrate: $(autopod:autocalibrate)',
			size: '13',
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		steps: [
			{
				down: [
					{
						actionId: 'autoCalibrate',
						options: {
							val: '1',
						},
						delay: 0,
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: 'autoCalibrate',
						options: {
							val: '0',
						},
						delay: 0,
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'autocalibrate',
				style: {
					bgcolor: 233490,
				},
			},
		],
	}

	presets['recall-speed-25'] = {
		type: 'button',
		category: 'Recall Preset',
		name: 'Recall speed 25%',
		style: {
			text: 'Recall Speed 25%',
			size: 'auto',
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		steps: [
			{
				down: [
					{
						actionId: 'recallSpeed',
						options: {
							val: 25,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['recall-speed-50'] = {
		type: 'button',
		category: 'Recall Preset',
		name: 'Recall speed 50%',
		style: {
			text: 'Recall Speed 50%',
			size: 'auto',
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		steps: [
			{
				down: [
					{
						actionId: 'recallSpeed',
						options: {
							val: 50,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['recall-speed-75'] = {
		type: 'button',
		category: 'Recall Preset',
		name: 'Recall speed 75%',
		style: {
			text: 'Recall Speed 75%',
			size: 'auto',
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		steps: [
			{
				down: [
					{
						actionId: 'recallSpeed',
						options: {
							val: 75,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['recall-speed-100'] = {
		type: 'button',
		category: 'Recall Preset',
		name: 'Recall speed 100%',
		style: {
			text: 'Recall Speed 100%',
			size: 'auto',
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		steps: [
			{
				down: [
					{
						actionId: 'recallSpeed',
						options: {
							val: 100,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	return presets
}
/*
25 = 0x3ff
50 = 0x7ff
75 = 0xbff
100 = 0xFFF
*/
