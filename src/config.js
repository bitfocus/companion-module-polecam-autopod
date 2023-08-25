export const ConfigFields = [
	{
		type: 'textinput',
		id: 'host',
		label: 'IP',
		width: 4,
		// regex: Regex.IP
	},
	{
		type: 'static-text',
		id: 'debugInfo',
		width: 11,
		label: 'Enable Debug To Log Window',
		value:
			'Requires the module to be restarted. But this will allow you the see what is being sent from the module and what is being received from the camera.',
	},
	{
		type: 'checkbox',
		id: 'debug',
		width: 1,
		label: 'Enable',
		default: false,
	},
]
