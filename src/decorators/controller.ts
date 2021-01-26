import { ClassOptions, Controller as _Controller, Get as _Get } from '@overnightjs/core'
import { injectable } from 'tsyringe'
import { constructor } from 'tsyringe/dist/typings/types'

export function Controller(path?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (target: constructor<any>) => {
        injectable()(target)

        ClassOptions(
            {
                caseSensitive: true,
                mergeParams: true,
                strict: true,
            },
        )(target)

        if (typeof path === 'undefined') {
            path = ''
        }

        return _Controller(path)(target)
    }
}

export function Get(path?: string): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        if (typeof path === 'undefined') {
            path = ''
        }

        return _Get(path)(target, propertyKey, descriptor)
    }
}
