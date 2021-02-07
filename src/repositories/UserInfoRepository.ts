import { UserInfo } from '../models/UserInfo'
import { Request } from 'express'

export class UserInfoRepository {
    public async getFromRequest(req: Request): Promise<UserInfo> {
        return new UserInfo({
            requestTime: new Date(),
            ip: req.ip,
            userAgent: req.header('user-agent'),
        })
    }
}
