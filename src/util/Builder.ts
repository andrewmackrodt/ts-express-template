import { Mutable, constructor, DeepPartial } from '../../types/lib'

type Chain<T, U, P extends keyof U> = { [key: string]: U[P] } extends U
    ? {
        create(): T
        createWithoutConstructor(): T
        props(): Mutable<T>
      }
    : Builder<T, Omit<U, P>>

export class Builder<T, U = Mutable<T>> {
    protected readonly ctor: constructor<T>
    protected readonly _props = {} as DeepPartial<T>

    public constructor(ctor: constructor<T>) {
        this.ctor = ctor
    }

    public using<P extends keyof U>(key: P, value: U[P]): Chain<T, U, P> {
        const builder = new Builder(this.ctor)

        Object.assign(builder._props, {
            ...this._props,
            [key]: value,
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return builder as any
    }

    // todo is it possible to build an array of all props of T at runtime
    // so that these 'protected' methods can be returned as public using
    // a different object?

    protected create(): T {
        return Object.assign(new this.ctor(), this._props)
    }

    protected createWithoutConstructor(): T {
        return Object.assign(Object.create(this.ctor), this._props)
    }

    protected props(): Mutable<T> {
        return this._props as Mutable<T>
    }
}

export const builder = <T>(ctor: constructor<T>) => new Builder(ctor)
