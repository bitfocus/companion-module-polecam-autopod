import { runEntrypoint, InstanceBase, InstanceStatus } from '@companion-module/base'
import { getActionDefinitions } from './actions.js'
import { getFeedbackDefinitions } from './feedbacks.js'
import { getPresetDefinitions } from './presets.js'
import { setVariables, checkVariables } from './variables.js'
import { ConfigFields } from './config.js'
import got from 'got'

// ########################
// #### Instance setup ####
// ########################
class PanasonicPTZInstance extends InstanceBase {
	async getCameraInformation() {
		if (this.config.host) {
			const url = `http://${this.config.host}:${this.config.httpPort}/live/camdata.html`

			try {
				const response = await got.get(url);
				if (response.body) {
					const lines = response.body.split('\r\n') // Split Data in order to remove data before and after command

					for (let line of lines) {
						// remove new line, carage return and so on.
						const str = line.trim().split(':') // Split Commands and data
						if (this.config.debug) {
							this.log('info', 'Recived CMD: ' + String(str))
						}
						// Store Data
						this.storeData(str)
					}

					this.checkVariables()
					this.checkFeedbacks()

					return true
				}
			} catch (err) {
				this.log('error', 'Error from PTZ: ' + String(err))
			}
		}

		return false;
	}

	storeData(str) {
		if (str[0].substring(0, 3) === 'rER') {
			if (str[0] === 'rER00') {
				this.data.error = 'No Errors'
			} else {
				this.data.error = str[0]
			}
		}

		if (str[0].substring(0, 4) === 'qSV3') {
			this.data.version = str[0].substring(4)
		}

		// Store Values from Events
		switch (str[0]) {
			case 'OID':
				this.data.modelTCP = str[1]
				// if a new model is detected or seected, re-initialise all actions, variable and feedbacks
				if (this.data.modelTCP !== this.data.model) {
					this.init_actions() // export actions
					this.init_presets()
					this.init_variables()
					this.checkVariables()
					this.init_feedbacks()
					this.checkFeedbacks()
				}
				break
			case 'TITLE':
				this.data.name = str[1]
				break
			default:
				break
		}
	}
	// When module gets deleted
	async destroy() {}

	// Initalize module
	async init(config) {
		this.config = config

		this.data = {
			debug: true,
			model: 'Auto',
			series: 'Auto',
			name: 'N/A',
			error: 'N/A',
		}

		this.ptSpeed = 25
		this.ptSpeedIndex = 25

		this.config.host = this.config.host || ''
		this.config.httpPort = this.config.httpPort || 80
		this.config.model = this.config.model || 'Auto'
		this.config.debug = this.config.debug || false

		this.updateStatus(InstanceStatus.Connecting)
		this.getCameraInformation().then((result) => {
			if (result) {
				this.updateStatus(InstanceStatus.Ok)
			} else {
				this.updateStatus(InstanceStatus.UnknownError, 'Error getting camera information')
			}
		}).catch((err) => {
			this.log('error', "ERROR getting camera information", err)
			this.updateStatus(InstanceStatus.UnknownError, 'Error getting camera information')
		});
		this.init_actions() // export actions
		this.init_presets()
		this.init_variables()
		this.checkVariables()
		this.init_feedbacks()
		this.checkFeedbacks()
	}

	// Update module after a config change
	async configUpdated(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Connecting)
		this.getCameraInformation().then((result) => {
			if (result) {
				this.updateStatus(InstanceStatus.Ok)
			} else {
				this.updateStatus(InstanceStatus.UnknownError, 'Error getting camera information')
			}
		}).catch((err) => {
			this.log('error', "ERROR getting camera information", err)
			this.updateStatus(InstanceStatus.UnknownError, 'Error getting camera information')
		});
		this.init_actions() // export actions
		this.init_presets()
		this.init_variables()
		this.checkVariables()
		this.init_feedbacks()
		this.checkFeedbacks()
	}

	// Return config fields for web config
	getConfigFields() {
		return ConfigFields
	}

	// ##########################
	// #### Instance Presets ####
	// ##########################
	init_presets() {
		this.setPresetDefinitions(getPresetDefinitions(this))
	}
	// ############################
	// #### Instance Variables ####
	// ############################
	init_variables() {
		this.setVariableDefinitions(setVariables(this))
	}
	// Setup Initial Values
	checkVariables() {
		checkVariables(this)
	}
	// ############################
	// #### Instance Feedbacks ####
	// ############################
	init_feedbacks() {
		this.setFeedbackDefinitions(getFeedbackDefinitions(this))
	}

	init_actions() {
		this.setActionDefinitions(getActionDefinitions(this))
	}
}

runEntrypoint(PanasonicPTZInstance, [])
