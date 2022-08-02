import pino from 'pino'
import { contextState } from '../async-context';

// sets log-level based on env variable
export const logLevel = (): string => {
    const config = process.env['CONNECTOR_CONFIG'];
    if (config != undefined) {
        const configDecoded = JSON.parse(Buffer.from(config, 'base64').toString());

        const debugLoggingEnabled = configDecoded['spConnDebugLoggingEnabled'];
        if (debugLoggingEnabled != undefined && debugLoggingEnabled === true) {
            return 'debug';
        } else {
            return 'info';
        }
    }

    return 'info';
}

export const logger = pino({
    timestamp:false,
	messageKey: 'message',
    level: logLevel(),
    base:undefined,
	formatters: {
		level: (label: string) => {
			return { level: label.toUpperCase() }
		},
	},
    mixin(){
        return { 
            ...contextState.getStore()
        };
    },
    mixinMergeStrategy(mergeObject:any, mixinObject:any) {
        return {...mergeObject, ...mixinObject}
    }
})
