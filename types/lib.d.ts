/* eslint-disable @typescript-eslint/no-explicit-any */
//region objects
export type DeepPartial<T> =
    T extends Function ? T :
    T extends Date ? T :
    T extends (infer U)[] ? DeepPartialArray<U> :
    T extends object ? DeepPartialObject<T> :
    T

export interface DeepPartialArray<T> {
    [key: number]: DeepPartial<T>
}

export type DeepPartialObject<T extends object> = {
    [K in keyof T]?: DeepPartial<T[K]>
}

export type Nullable<T> = T | null

export type Optional<T> = Nullable<T> | undefined

export type Static<T extends constructor<T>> = new(...args: any[]) => InstanceType<T>

export interface constructor<T> {
    new (...args: any[]): T
}
//endregion

//region props
export type KeyOf<T> = {
    [K in keyof T]: T[K] extends Function ? never : K & string
}[keyof T]

export type Props<T> = Pick<T, KeyOf<T>>

export type PartialProps<T> = DeepPartial<Props<T>>

export type IsEqual<A, B> =
    (<T>() => T extends A ? 1 : 2) extends
    (<T>() => T extends B ? 1 : 2) ? true : false

export type MutableKeyOf<T> = {
    [K in keyof T]:
        T[K] extends Function ? never :
        IsEqual<{ [U in K]: T[U] }, { -readonly [Q in K]: T[K] }> extends true ? K & string :
        never
}[keyof T]

export type Mutable<T> = Pick<T, MutableKeyOf<T>>

export type PartialMutable<T> = DeepPartial<Mutable<T>>
//endregion

//region case
export type ToCamel<S> = S extends `${infer Head}_${infer Tail}` ? `${Head}${Capitalize<ToCamel<Tail>>}` : S

type CamelValue<T> =
    T extends object ? ObjectToCamel<T> :
    T extends [] ? { [key: number]: CamelValue<T> } :
    T

export type ObjectToCamel<T> = {
    [K in keyof T as ToCamel<K>]: CamelValue<T[K]>
}

export type ToSnake<S> = S extends `${infer T}${infer U}` ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${ToSnake<U>}` : S

type SnakeValue<T> =
    T extends object ? ObjectToSnake<T> :
    T extends [] ? { [key: number]: SnakeValue<T> } :
    T

export type ObjectToSnake<T> = {
    [K in keyof T as ToSnake<K>]: SnakeValue<T[K]>
}
//endregion

//region json
export type JsonPrimitive = string | number | boolean | null

export interface JsonArray<T> {
    [key: number]: JsonValue<T>
}

export type JsonValue<T> =
    T extends Function ? never :
    T extends Date ? string :
    T extends (infer U)[] ? JsonArray<U> :
    T extends object ? JsonObject<T> :
    T extends JsonPrimitive ? T :
    never

export type JsonObject<T extends Record<string, any>> = {
    [K in keyof Props<T>]: JsonValue<T[K]>
}

export type PartialJsonObject<T extends Record<string, any>> = DeepPartial<JsonObject<T>>

export interface MutableJsonArray<T> {
    [key: number]: MutableJsonValue<T>
}

export type MutableJsonValue<T> =
    T extends Function ? never :
    T extends Date ? string :
    T extends (infer U)[] ? MutableJsonArray<U> :
    T extends object ? MutableJsonObject<T> :
    T extends JsonPrimitive ? T :
    never

export type MutableJsonObject<T extends Record<string, any>> = {
    [K in keyof Mutable<T>]: MutableJsonValue<T[K]>
}

export type PartialMutableJsonObject<T extends Record<string, any>> = DeepPartial<MutableJsonObject<T>>

export type MutableJsonCamelObject<T extends Record<string, any>> = ObjectToCamel<MutableJsonObject<T>>

export type PartialMutableJsonCamelObject<T extends Record<string, any>> = DeepPartial<MutableJsonCamelObject<T>>

export type MutableJsonSnakeObject<T extends Record<string, any>> = ObjectToSnake<MutableJsonObject<T>>

export type PartialMutableJsonSnakeObject<T extends Record<string, any>> = DeepPartial<MutableJsonSnakeObject<T>>
//endregion
