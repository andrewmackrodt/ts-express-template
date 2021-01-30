import { Controller, Get } from '../decorators/controller'
import { UserInfoRepository } from '../repositories/UserInfoRepository'
import { constants } from 'http2'
import { Response, Request } from 'express'

@Controller()
export class HomeController {
    public constructor(
        protected readonly repository: UserInfoRepository,
    ) { }

    @Get()
    public async getIndex(req: Request, res: Response): Promise<void> {
        const userInfo = await this.repository.getFromRequest(req)

        res.status(constants.HTTP_STATUS_OK).json(userInfo)
    }
}
