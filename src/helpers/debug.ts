import { Debugger, debug } from 'debug'

const prefix = 'app'

function create(name: string): Debugger {
    const logger = debug(`${prefix}:${name}`)
    logger.enabled = true

    return logger
}

const _error = create('error')
const _log = create('log')

/* eslint-disable @typescript-eslint/no-explicit-any */

export function error(formatter: any, ...args: any[]) {
    _error(formatter, ...args)
}

export function log(formatter: any, ...args: any[]) {
    _log(formatter, ...args)
}

/* eslint-enable @typescript-eslint/no-explicit-any */
