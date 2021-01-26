import { error, log } from '../helpers/debug'
import { Server as OvernightServer } from '@overnightjs/core'
import { Controller, RouterLib } from '@overnightjs/core/lib/decorators/types'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import { CorsOptions } from 'cors'
import * as cors from 'cors'
import { ErrorRequestHandler, RequestHandler } from 'express'
import * as morgan from 'morgan'
import { container } from 'tsyringe'
import { Server as ExpressServer } from 'http'
import { constants } from 'http2'

export interface ServerOptions {
    compression?: boolean
    cors?: boolean | CorsOptions
    graceful?: boolean
    hostname?: string
    port?: number
    timeout?: number
    trustProxy?: boolean
}

export class Server extends OvernightServer {
    public static readonly DEFAULT_PORT: number = 5000

    protected readonly options: Required<ServerOptions>
    private _port?: number
    private _server?: ExpressServer

    public constructor(options?: ServerOptions) {
        super(false)

        this.options = Object.assign(
            {
                compression: true,
                cors: true,
                graceful: process.env.NODE_ENV === 'production',
                hostname: '0.0.0.0',
                port: 0,
                timeout: 30000,
                trustProxy: true,
            },
            options)
    }

    public addControllers(
        controllers: Controller | Controller[],
        routerLib?: RouterLib,
        globalMiddleware?: RequestHandler,
    ) {
        // ensture controllers is an array
        if ( ! Array.isArray(controllers)) controllers = [controllers]

        controllers = [...controllers].map(c => {
            // resolve classes from the container if not a class instance
            if ( ! Object.getPrototypeOf(c)?.prototype) {
                c = container.resolve(c)
            }
            return c
        })

        super.addControllers(controllers, routerLib, globalMiddleware)

        this.configure()
    }

    public start(): void {
        this._server = this.app.listen(
            this.port,
            this.options.hostname,
            () => {
                log(`running server on port ${this.port}`)
            })

        this._server.setTimeout(this.options.timeout)
    }

    protected get port(): number {
        if ( ! this._port) {
            if (this.options.port !== 0) {
                this._port = this.options.port
            } else if ( ! process.env.PORT) {
                this._port = Server.DEFAULT_PORT
            } else {
                const parsed = Number.parseInt(process.env.PORT)

                if (Number.isNaN(parsed)) {
                    throw new Error('process.env.PORT must be a number')
                }

                this._port = parsed
            }
        }

        return this._port
    }

    private configure(): void {
        if ( ! process.env.JEST_WORKER_ID && this.options.graceful) {
            this.addShutdownHandler()
        }

        this.app.disable('x-powered-by')

        if (this.options.trustProxy) {
            this.app.set('trust proxy', true)
        }

        this.app.use(bodyParser.json())

        if (this.options.compression) {
            this.app.use(compression())
        }

        if (this.options.cors) {
            if (typeof this.options.cors === 'object') {
                this.app.use(cors(this.options.cors))
            } else {
                this.app.use(cors())
            }
        }

        this.app.use(morgan('combined'))
        this.addErrorHandler()
    }

    private addShutdownHandler() {
        process.on('SIGINT', () => {
            if ( ! this._server) {
                process.exit(2)
            }

            this._server.close(err => {
                if (err) {
                    error(err)
                }

                process.exit(err ? 1 : 0)
            })
        })
    }

    private addErrorHandler() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const handler: ErrorRequestHandler = ((err, req, res, next) => {
            const data = {
                error: {
                    message: 'An unknown error occurred please try again later.',
                },
            }
            let error = err
            if (typeof error === 'object') {
                if (typeof error.message !== 'string' && typeof error.error === 'object') {
                    error = error.error
                }
                if (typeof error.message === 'string') {
                    data.error.message = error.message
                }
            }
            res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json(data)
        })

        this.app.use(handler)
    }
}
