import { Mutable } from '../../types/lib'
import { JsonObject } from '../mixins/JsonObject'
import { Expose, Type } from 'class-transformer'
import { Mixin } from 'ts-mixer'

export class UserInfo extends Mixin(JsonObject){
    @Expose() @Type(() => Date) public requestTime!: Date
    @Expose() public ip!: string
    @Expose() public userAgent?: string

    public constructor(props?: Mutable<UserInfo>) {
        super()
        if (props) this.fill(props)
    }
}
