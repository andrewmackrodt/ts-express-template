import { debug } from 'debug'
import * as cluster from 'cluster'
import * as os from 'os'

const log = debug('cluster')

log.enabled = true

if (cluster.isMaster) {
    let respawn = true

    process.on('SIGINT', () => {
        // prevent terminated workers from respawning
        respawn = false

        // ensure SIGINT propagates to all children
        for (const worker of Object.values(cluster.workers)) {
            worker?.process.kill('SIGINT')
        }
    })

    const createWorker = () => {
        const worker = cluster.fork()
        log(`worker started (${worker.process.pid})`)
    }

    cluster.on('exit', (worker, code, signal) => {
        const status = code ?? signal

        if (worker.isDead() && respawn) {
            // restart the worker if it has died and SIGINT has not been received
            log(`worker died (${worker.process.pid}) [${status}]`)
            createWorker()
        } else {
            // otherwise remove the worker from the pool
            if (code === 0) {
                log(`worker shutdown (${worker.process.pid}) [${status}]`)
            } else {
                log(`worker exited (${worker.process.pid}) [${status}]`)
            }
        }
    })

    os.cpus().map(() => createWorker())
} else {
    // noinspection ES6ConvertRequireIntoImport
    require('./index')
}
