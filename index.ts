import 'reflect-metadata'

import { HomeController } from './src/controllers/HomeController'
import { NotFoundController } from './src/controllers/NotFoundController'
import { Server } from './src/http/Server'
import PromiseRouter from 'express-promise-router'

export function createServer(): Server {
    const server = new Server({
        // compression: true,
        // cors: true,
        // graceful: process.env.NODE_ENV === 'production',
        // hostname: '0.0.0.0',
        // port: 0,
        // timeout: 30000,
        // trustProxy: true,
    })

    server.addControllers(
        [
            HomeController,
            NotFoundController,
        ],
        PromiseRouter)

    return server
}

if ( ! process.env.JEST_WORKER_ID) {
    createServer().start()
}
