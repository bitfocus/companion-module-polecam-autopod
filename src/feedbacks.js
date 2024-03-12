import { combineRgb } from '@companion-module/base'

// ##########################
// #### Define Feedbacks ####
// ##########################
export function getFeedbackDefinitions(self) {
	return {
		autocalibrate: {
			type: 'boolean',
			name: 'Autocalibrate is on',
			description:
				'If you have sent "autocalibrate on", this feedback will be true. It does not currently check with the device.',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			callback: () => {
				return self.data.autocalibrate
			},
		},
		calibrationstatus: {
			type: 'advanced',
			name: 'Calibration status',
			description:
				'Calibration status as background color. Green is calibrated, yellow is calibrating, red is uncalibrated',
			options: [
				{
					type: 'colorpicker',
					label: 'Calibrated background color',
					id: 'calibrated',
					default: combineRgb(0, 255, 0),
				},
				{
					type: 'colorpicker',
					label: 'Calibrated text color',
					id: 'calibrated_text',
					default: combineRgb(0, 0, 0),
				},
				{
					type: 'colorpicker',
					label: 'Calibrating background color',
					id: 'calibrating',
					default: combineRgb(255, 255, 0),
				},
				{
					type: 'colorpicker',
					label: 'Calibrating text color',
					id: 'calibrating_text',
					default: combineRgb(0, 0, 0),
				},
				{
					type: 'colorpicker',
					label: 'Uncalibrated',
					id: 'uncalibrated',
					default: combineRgb(255, 0, 0),
				},
				{
					type: 'colorpicker',
					label: 'Uncalibrated text color',
					id: 'uncalibrated_text',
					default: combineRgb(0, 0, 0),
				},
				{
					type: 'colorpicker',
					label: 'Error',
					id: 'motor_error',
					default: combineRgb(128, 0, 0),
				},
				{
					type: 'colorpicker',
					label: 'Error text color',
					id: 'error_text',
					default: combineRgb(0, 0, 0),
				},
			],
			callback: (feedback) => {
				if (self.data.calibration === 'calibrated') {
					return { bgcolor: feedback.options.calibrated, color: feedback.options.calibrated_text }
				}
				if (self.data.calibration === 'calibrating') {
					return { bgcolor: feedback.options.calibrating, color: feedback.options.calibrating_text }
				}
				if (self.data.calibration === 'uncalibrated') {
					return { bgcolor: feedback.options.uncalibrated, color: feedback.options.uncalibrated_text }
				}
				if (self.data.calibration === 'motor_error') {
					return { bgcolor: feedback.options.motor_error, color: feedback.options.error_text }
				}
				return {}
			},
		},
	}
}
