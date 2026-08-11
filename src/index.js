import { runEntrypoint, InstanceBase, InstanceStatus } from '@companion-module/base'
import { getActionDefinitions } from './actions.js'
import { getFeedbackDefinitions } from './feedbacks.js'
import { getPresetDefinitions } from './presets.js'
import { setVariables, checkVariables } from './variables.js'
import { ConfigFields } from './config.js'
import got from 'got'
import fs from 'fs/promises'

// ########################
// #### Instance setup ####
// ########################
class PanapodPTZInstance extends InstanceBase {
	static GetUpgradeScripts() {
		console.log('GetUpgradeScripts-panapod')
		return [
			(context, props) => {
				// From panasonic-panapod to polecam-autopod
				return {
					updatedConfig: props.config,
					updatedActions: props.actions.filter((action) => {
						if (action.actionId === 'stowLegs') {
							return false
						}
						return true
					}).map((action) => {
						if (action.actionId === 'stop') {
							return { ...action, actionId: 'stopud' }
						}
						if (action.actionId === 'showMode') {
							return { ...action, actionId: action.options.val === '0' ? 'stopDemoMode' : 'demoMode', options: {} }
						}
						return action
					}),
					updatedFeedbacks: [],
				}
			},
		]
	}

	async getCameraInformation() {
		if (this.config.host) {
			const url = `http://${this.config.host}:${this.config.httpPort}/live/camdata.html`

			const response = await got.get(url)
			if (response.body) {
				const lines = response.body.split('\r\n') // Split Data in order to remove data before and after command

				for (let line of lines) {
					// remove new line, carage return and so on.
					const str = line.trim().split(':') // Split Commands and data
					if (this.config.debug) {
						this.log('info', 'Received CMD: ' + String(str))
					}
					// Store Data
					this.storeData(str)
				}

				this.checkVariables()
				this.checkFeedbacks()

				return true
			}
		}

		return false
	}

	async getAWPTZ(command) {
		if (this.config.host) {
			try {
				const response = await got.get(
					`http://${this.config.host}:${this.config.httpPort}/cgi-bin/aw_ptz?cmd=${encodeURIComponent(command)}&res=1`,
				)
				if (response.body) {
					return response.body
				}
			} catch (err) {
				if (this.connected) {
					this.log('error', 'ERROR getting updated info', err)
					this.connected = false
					this.updateStatus(InstanceStatus.UnknownError, 'Error getting updated info')
				}
				return false
			}
		}
	}

	async getVersion() {
		const version = await this.getAWPTZ('#V?')
		if (version) {
			if (this.data.version !== version) {
				this.data.firmware = version
				this.setVariableValues({ firmware: this.data.firmware })
			}
		}
	}

	async checkCalibration() {
		const calibration = await this.getAWPTZ('#RER')
		if (!calibration) {
			return
		}

		let result = ''
		if (calibration.match(/rER53/)) {
			result = 'uncalibrated'
		} else if (calibration.match(/rER42/)) {
			result = 'calibrating'
		} else if (calibration.match(/rER03/)) {
			result = 'motor_error'
		} else if (calibration.match(/rER00/)) {
			result = 'calibrated'
		} else {
			result = 'N/A'
		}
		if (result != this.data.calibration) {
			this.data.calibration = result
			this.checkVariables()
			this.checkFeedbacks('calibrationstatus')
		}
	}

	async getPosition() {
		const position = await this.getAWPTZ('#APC')
		if (!position) {
			return
		}
		if (position.match(/aPC/)) {
			const pos = position.match(/aPC([a-f0-9]{4})([a-f0-9]{4})/i)
			let panposition = parseInt(pos[1], 16)
			let tiltposition = parseInt(pos[2], 16)
			if (panposition != this.data.panposition || tiltposition != this.data.tiltposition) {
				this.data.panposition = panposition
				this.data.tiltposition = tiltposition
				this.setVariableValues({
					panposition: this.data.panposition,
					tiltposition: this.data.tiltposition,
				})
			}
		}
	}

	async getPresetSpeed() {
		const speed = await this.getAWPTZ('#AXI')
		if (speed) {
			let match = speed.match(/axi([a-f0-9]{3})/i)
			if (match) {
				this.data.recallSpeed = Math.round(((parseInt(match[1], 16) - 0x555) / 0xaaa) * 100)
				this.setVariableValues({ recallSpeed: this.data.recallSpeed })
			}
		}
	}

	async getAutoCalibrate() {
		const autoCalibrate = await this.getAWPTZ('#D1')
		if (autoCalibrate) {
			const match = autoCalibrate.match(/d1([01])/i)
			if (match) {
				this.data.autocalibrate = match[1] === '1'
				this.checkFeedbacks('autocalibrate')
				this.setVariableValues({ autocalibrate: this.data.autocalibrate ? 'On' : 'Off' })
			}
		}
	}

	// Chefck something different every time
	async getUpdatedInfo() {
		if (!this.connected) {
			return
		}

		switch (this.inforotation % 5) {
			case 0:
				await this.getVersion()
				break
			case 1:
				await this.checkCalibration()
				break
			case 2:
				await this.getAutoCalibrate()
				break
			case 3:
				await this.getPresetSpeed()
				break
			case 4:
				await this.getPosition()
				break
		}

		this.inforotation++
	}

	storeData(str) {
		if (str[0].substring(0, 3) === 'rER') {
			if (str[0] === 'rER00') {
				this.data.error = 'No Errors'
			} else {
				this.data.error = str[0]
			}
		}

		if (str[0].substring(0, 3) === 'qSV') {
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

	async destroy() {
		this.connected = false
		clearInterval(this.connectionCheckTimer)
		clearInterval(this.infoFetcher)
	}

	async checkConnection() {
		try {
			if (!this.connected) {
				const result = await this.getCameraInformation()
				if (result) {
					if (!this.connected) {
						this.updateStatus(InstanceStatus.Ok)
						this.connected = true
					}
				} else {
					this.updateStatus(InstanceStatus.UnknownError, 'Error getting camera information')
				}
			}
		} catch (err) {
			this.log('error', 'ERROR getting camera information', err)
			this.updateStatus(InstanceStatus.ConnectionFailure, 'Error getting camera information')
		}
	}

	// Initalize module
	async init(config) {
		this.config = config

		this.data = {
			debug: true,
			model: 'Auto',
			series: 'Auto',
			name: 'N/A',
			error: 'N/A',
			firmware: 'N/A',
			calibration: 'N/A',
			tiltposition: -1,
			panposition: -1,
			recallSpeed: -1,
			autocalibrate: false,
		}

		this.inforotation = 0

		this.connected = false

		this.panning = 0
		this.tilting = 0

		this.ptSpeed = 25
		this.ptSpeedIndex = 25

		this.config.host = this.config.host || ''
		this.config.httpPort = this.config.httpPort || 80
		this.config.model = this.config.model || 'Auto'
		this.config.debug = this.config.debug || false

		this.updateStatus(InstanceStatus.Connecting)
		this.init_actions() // export actions
		this.init_presets()
		this.init_variables()
		this.checkVariables()
		this.init_feedbacks()
		this.checkFeedbacks()

		this.connectionCheckTimer = setInterval(() => {
			this.checkConnection()
		}, 2000)
		this.infoFetcher = setInterval(() => {
			this.getUpdatedInfo()
		}, 500)
	}

	// Update module after a config change
	async configUpdated(config) {
		this.config = config
		this.data = {
			debug: this.data.debug,
			model: 'Auto',
			series: 'Auto',
			name: 'N/A',
			error: 'N/A',
			firmware: 'N/A',
			calibration: 'N/A',
			tiltposition: -1,
			panposition: -1,
			autocalibrate: false,
		}
		this.updateStatus(InstanceStatus.Connecting)
		this.connected = false
		this.checkConnection()
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

runEntrypoint(PanapodPTZInstance, PanapodPTZInstance.GetUpgradeScripts())
