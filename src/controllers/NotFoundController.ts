import { Controller, Get } from '../decorators/controller'
import { Request, Response } from 'express'
import { constants } from 'http2'

@Controller('*')
export class NotFoundController {
    @Get('*')
    public async getNoRoute(req: Request, res: Response): Promise<void> {
        res.status(constants.HTTP_STATUS_NOT_FOUND).json({
            error: { message: 'Not Found' },
        })
    }
}
