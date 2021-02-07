import { Controller, Get } from '../decorators/controller'
import { UserInfoRepository } from '../repositories/UserInfoRepository'
import { Response, Request } from 'express'
import { constants } from 'http2'

@Controller()
export class HomeController {
    public constructor(
        protected readonly repository: UserInfoRepository,
    ) { }

    @Get()
    public async getIndex(req: Request, res: Response): Promise<void> {
        const userInfo = await this.repository.getFromRequest(req)
        const json = userInfo.toJson({ transformCase: 'snake' })

        res.status(constants.HTTP_STATUS_OK).json(json)
    }
}
