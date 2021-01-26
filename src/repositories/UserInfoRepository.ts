import { UserInfo } from '../models/UserInfo'
import { Request } from 'express'

export class UserInfoRepository {
    public async getFromRequest(req: Request): Promise<UserInfo> {
        const userInfo = new UserInfo()
        userInfo.ip = req.ip
        userInfo.user_agent = req.header('user-agent') || undefined

        return userInfo
    }
}
