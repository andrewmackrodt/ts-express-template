import {
    Mutable,
    MutableJsonCamelObject,
    MutableJsonObject,
    MutableJsonSnakeObject,
    PartialMutable,
    PartialMutableJsonCamelObject,
    PartialMutableJsonObject,
    PartialMutableJsonSnakeObject,
    Static,
} from '../../types/lib'
import { toCamelCase, toSnakeCase } from '../helpers/text'
import { classToPlain, plainToClass, plainToClassFromExist } from 'class-transformer'
import { mergeWith } from 'lodash'

interface JsonOptions {
    transformCase?: 'camel' | 'snake'
}

interface CamelTransform extends JsonOptions {
    transformCase: 'camel'
}

interface SnakeTransform extends JsonOptions {
    transformCase: 'snake'
}

interface NoTransform extends JsonOptions {
    transformCase: undefined
}

export function create<T>(ctor: new () => T, data: MutableJsonSnakeObject<T>, options: CamelTransform): T
export function create<T>(ctor: new () => T, data: MutableJsonCamelObject<T>, options: SnakeTransform): T
export function create<T>(ctor: new () => T, data: MutableJsonObject<T>, options?: NoTransform): T

export function create<T>(
    ctor: new () => T,
    data: MutableJsonCamelObject<T> | MutableJsonSnakeObject<T> | MutableJsonObject<T>,
    options?: JsonOptions,
): T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return JsonObject.create.call(ctor, data, options as any) as T
}

export class JsonObject {
    public static create<T extends Static<T>>(this: T, data: MutableJsonSnakeObject<InstanceType<T>>, options: CamelTransform): InstanceType<T>
    public static create<T extends Static<T>>(this: T, data: MutableJsonCamelObject<InstanceType<T>>, options: SnakeTransform): InstanceType<T>
    public static create<T extends Static<T>>(this: T, data: MutableJsonObject<InstanceType<T>>, options?: NoTransform): InstanceType<T>

    public static create<T extends Static<T>>(
        this: T,
        data: MutableJsonCamelObject<InstanceType<T>> | MutableJsonSnakeObject<InstanceType<T>> | MutableJsonObject<InstanceType<T>>,
        options?: JsonOptions,
    ): InstanceType<T> {
        let transformed = {}

        switch (options?.transformCase) {
            case 'camel':
                transformed = toCamelCase(data)
                break
            case 'snake':
                transformed = toSnakeCase(data)
                break
            default:
                transformed = data
        }

        return plainToClass(this, transformed)
    }

    public fill<T>(this: T, data: Mutable<T>): T {
        return Object.assign(this, data)
    }

    public fillFromJson<T>(this: T, data: MutableJsonSnakeObject<T>, options: CamelTransform): T
    public fillFromJson<T>(this: T, data: MutableJsonCamelObject<T>, options: SnakeTransform): T
    public fillFromJson<T>(this: T, data: MutableJsonObject<T>, options?: NoTransform): T

    public fillFromJson<T>(
        this: T,
        data: MutableJsonCamelObject<T> | MutableJsonSnakeObject<T> | MutableJsonObject<T>,
        options?: JsonOptions,
    ): T {
        let transformed = {}

        switch (options?.transformCase) {
            case 'camel':
                transformed = toCamelCase(data)
                break
            case 'snake':
                transformed = toSnakeCase(data)
                break
            default:
                transformed = data
        }

        return plainToClassFromExist(this, transformed)
    }

    public patch<T>(this: T, data: PartialMutable<T>): T {
        return mergeWith(this, data, (target: unknown, src: unknown) => {
            if (Array.isArray(target) || Array.isArray(src)) return src
        })
    }

    public patchFromJson<T>(this: T, data: PartialMutableJsonSnakeObject<T>, options: CamelTransform): T
    public patchFromJson<T>(this: T, data: PartialMutableJsonCamelObject<T>, options: SnakeTransform): T
    public patchFromJson<T>(this: T, data: PartialMutableJsonObject<T>, options?: NoTransform): T

    public patchFromJson<T extends JsonObject>(
        this: T,
        data: PartialMutableJsonCamelObject<T> | PartialMutableJsonSnakeObject<T> | PartialMutableJsonObject<T>,
        options?: JsonOptions,
    ): T {
        let transformed = {}

        switch (options?.transformCase) {
            case 'camel':
                transformed = toCamelCase(data)
                break
            case 'snake':
                transformed = toSnakeCase(data)
                break
            default:
                transformed = data
        }

        transformed = mergeWith(this.toJson(), transformed, (target: unknown, src: unknown) => {
            if (Array.isArray(target) || Array.isArray(src)) return src
        })

        return plainToClassFromExist(this, transformed)
    }

    public toJson<T>(this: T, options: CamelTransform): MutableJsonCamelObject<T>
    public toJson<T>(this: T, options: SnakeTransform): MutableJsonSnakeObject<T>
    public toJson<T>(this: T, options?: NoTransform): MutableJsonObject<T>

    public toJson(options?: JsonOptions) {
        let transformed = classToPlain(this, { strategy: 'excludeAll' })

        transformed = JSON.parse(JSON.stringify(transformed))

        switch (options?.transformCase) {
            case 'camel':
                transformed = toCamelCase(transformed)
                break
            case 'snake':
                transformed = toSnakeCase(transformed)
                break
        }

        return transformed
    }
}
