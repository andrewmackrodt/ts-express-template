# ts-express-template

## Quick Start

Node.js v12 or greater is required:

```sh
git clone https://github.com/andrewmackrodt/ts-express-template.git
cd ts-express-template
npm install
npm run start
```

## Using Docker

### Development

A `docker-compose.yml` file is included to allow getting started without the
necessary node runtime on the host. The compose file will mount the project
directory into the container and create a separate `node_modules` mount to
avoid conflicts with the host.

The first start of the container may be slow while the project dependencies
are installed.

```sh
# install the project dependencies - this should be run once
# before any other command or when package.json is modified
docker-compose run npm install

# start the development server
docker-compose up

# run the test suite
docker-compose run npm run test

# remove the container and cache volumes
docker-compose down -v
```

### Building an image for deployment

A multi-stage `Dockerfile` is provided which creates a small docker image (~20MB)
containing a static binary produced by [nexe](https://github.com/nexe/nexe).

```sh
docker build -t ts-express-template .
```


## Commands

| Command | Description |
|---|---|
| `npm run start` | Starts the development server on [http://localhost:5000][dev].<br>The environment variable `PORT` may be used to override the port,<br>e.g. `PORT=8080 npm run start`|
| `npm run lint` | Runs eslint; run `npm run lint:fix` to automatically fix errors |
| `npm run test` | Runs the jest test suite |
| `npm run coverage` | Generates the test suite coverage report in `./coverage` |
| `npm run build` | Creates a production build in `./build` |
| `npm run clean` | Removes coverage and build files |

[dev]: http://localhost:5000
