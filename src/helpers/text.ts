import { ObjectToCamel, ObjectToSnake } from '../../types/lib'
import { camelCase } from 'camel-case'
import * as camelCaseKeys from 'camelcase-keys'
import { snakeCase } from 'snake-case'
import * as snakeCaseKeys from 'snakecase-keys'

export function toCamelCase(s: string): string
export function toCamelCase<T extends object>(obj: T): ObjectToCamel<T>

export function toCamelCase(s: string | object) {
    if (typeof s === 'string') {
        return camelCase(s)
    } else {
        return camelCaseKeys(s)
    }
}

export function toSnakeCase(s: string): string
export function toSnakeCase<T extends object>(obj: T): ObjectToSnake<T>

export function toSnakeCase(s: string | object) {
    if (typeof s === 'string') {
        return snakeCase(s)
    } else {
        return snakeCaseKeys(s)
    }
}
