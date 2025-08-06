---
title: Simple project for Node.js with Express.js and Docker
date: '2023-02-05'
description: Simple and beginner-friendly docker container with healthcheck endpoint to call.
img: /media/blog/simple-nodejs-project/expressjs.png
img_transparent: false
published: true
---

## Description

I made this simple project to learn and to provide example of how to make simple API in Node.js with Express.js middleware (and Typescript but what did you expect 😅).

This project was made to be simple example, how to implement API with Express and to have a simple to understand documentation for every one to use and learn.

**_Link to GitHub repo [here](https://github.com/matus-barta/healthcheck)._**

_If you find a bug or want to suggest a new feature, feel free to create an issue on [GitHub page](https://github.com/matus-barta/healthcheck/issues)_

### Practical use

I use this by myself to check if [DDNS](https://github.com/timothymiller/cloudflare-ddns) I use is correctly running and pointing to my homelab. The service is running on docker, managed by [Portainer](https://www.portainer.io/) and behind [Nginx Proxy Manager](https://nginxproxymanager.com/). I check if the service is up with [Uptime-Kuma](https://github.com/louislam/uptime-kuma), this way I can see if all parts of the chain are working correctly.

## Technical specification

### API Endpoint

- HTTP request to `http://address:port/healthcheck` or `http://address:port/`
- return JSON `{"Status" : "OK"}` or plaintext `OK`
- If the endpoint is disabled will return `404` status

### Tech stack

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://www.npmjs.com/package/express) - HTTP server
- [Typescript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/) - for testing
- [Docker](https://www.docker.com/) and Docker-Compose - to run on homelab docker server
- [GitHub Actions](https://github.com/features/actions) - to run CI/CD for publishing to docker container repository

### How to get started with development

Visit GitHub [page](https://github.com/matus-barta/healthcheck#development)

## The code overview

Below are just short code snippets, check the GitHub for full source files.

### Main source files

Overview of the main source files. If you see `...` then I left the code out because is not important or repeating.

#### index.ts

In the `index.ts` we load the configuration and start the Express HTTP server. After that, we let know the user what configuration we are running and if it's incorrect we terminate the application.

```ts
dotenv.config(); // initialize configuration for .env file

// start HTTP server to be listening
app.listen(port, host, () => {
	log.info(`⚡️ : Server is running at http://${host}:${port}`);
	checkEnvEndpoints(); // show what setting we are using and check if they are correct
});
```

#### app.ts

In `app.ts` we initialize the Express.js HTTP server, we set it up to use JSON middleware and our routes defined in `routes.ts`. Other than, we load the server settings from environment variables.

```ts
// loading the config variables for server and routes config
export const port = Number(process.env.PORT ?? 8082);
...
export let rootRes = Boolean(process.env.ROOT_RES ?? true);

const app = express(); // init express
app.use(express.json()); // init to use json middleware
routes(app); // load our routes (defined in routes.ts)

export default app; // export app express object (used mostly in index.ts)

// helper function to setup env variables outside of app.ts (used for testing)
export function setEnv(JSON: boolean, endpoint: boolean, root: boolean) {...}
```

#### routes.ts

In `routes.ts` we register and define behavior of our routes.

```ts
// default function to handle route registration
export default function (app: Express) {
	// define a route handler for the root route
	app.get('/', (req: Request, res: Response) => processRoot(req, res));

	//define a route for the /healthcheck route
	app.get('/healthcheck', (req: Request, res: Response) => processEndpoint(req, res));
}

// handle root route
function processRoot(req: Request, res: Response) {
	if (rootRes) res.send(processMessage(req, res)); // if enabled respond
	else res.sendStatus(404); // if not return 404
}

// handle /healthcheck route
function processEndpoint(req: Request, res: Response) {...}

// log request (if testing) and response with JSON or plaintext based on settings
function processMessage(req: Request, res: Response) {
	if (process.env.NODE_ENV != 'test') log.info(`⚡️ : Request from: ${req.ip}`);

	if (useJSON) {
		res.type('json'); // set response type
		return '{"status": "OK"}'; // return response
	} else {...}
}
```

### Testing

I am using Jest for testing. No real preference here, more like I found it after quick search and was pretty easy to use. Sometimes I use Postman for API testing and development, it has really nice interface and it is configurable, but it is completely separated from your codebase what may make you duplicate a some code.

#### In `jest.config.js`

```js
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node'
};
```

#### In folder `__tests__` and file `app.test.ts`

```ts
// setup before all tests begin
beforeAll(() => {
	process.env.NODE_ENV = 'test'; // set env var to test to enable logs
});

// setup before each test
beforeEach(() => {
	server = app.listen(port, host); // start express server
});

// after each test is done
afterEach(() => {
	server.close(); // stop the express server
});

// testing endpoint /healthcheck
describe('ENDPOINT: /healthcheck', () => {
	// test JSON response
	it('JSON         - 200', async () => {
		// set env var for the test
		// enable JSON and healthcheck endpoint disable root endpoint
		setEnv(true, true, false);

		const res = await request(app).get('/healthcheck'); // run request

		expect(res.statusCode).toBe(200); // check for 200
		expect(res.body).toEqual({ status: 'OK' }); // check for JSON response
	});

	// test plaintext response
	it('TEXT         - 200', async () => {
		// set env var for the test
		// enable plaintext and healthcheck endpoint disable root endpoint
		setEnv(false, true, false);

		const res = await request(app).get('/healthcheck'); // run request

		expect(res.statusCode).toBe(200); // check for 200
		expect(res.text).toEqual('OK'); // check for plaintext response
	});

	// test if we contact root when disabled we get 404
	it('/            - 404', async () => {
		// set env var for the test
		// enable plaintext and healthcheck endpoint disable root endpoint
		setEnv(false, true, false);

		const res = await request(app).get('/'); // run request

		expect(res.statusCode).toBe(404); // check for 404
	});
});
```

#### We run test with command `npm run test` and output will look like somthing this

```
 PASS  __tests__/app.tests.ts
  ENDPOINT: /healthcheck
    ✓ JSON         - 200 (14 ms)
    ✓ TEXT         - 200 (2 ms)
    ✓ /            - 404 (1 ms)
  ENDPOINT: /
    ✓ JSON         - 200 (2 ms)
    ✓ TEXT         - 200 (1 ms)
    ✓ /healthcheck - 404 (2 ms)
  ENDPOINT: both
    ✓ /            - 404 (1 ms)
    ✓ /healthcheck - 404 (1 ms)

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        0.977 s
Ran all test suites.
```

### Docker and docker-compose

We use GitHub docker repository to distribute the project. Also docker is easy way to run it on server.

#### Dockerfile

To make a docker container we need to make a dockerfile. And build it. This dockerfile has two stages.

- 1st stage to build the project (transpile TS to JS)
- 2nd stage is to run the project (the JS files)

```dockerfile
# stage one
# we base you dockerfile on alpine linux with node preinstalled
FROM node:16.15.1-alpine AS node-build

# set our work directory
WORKDIR /usr

# copy package.json tsconfig.json and all the source files
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src

# run npm to install packages and build the project
RUN ls -a
RUN npm install
RUN npm run build

# stage two
# again we base the package on alpine linux with node
FROM node:16.15.1-alpine
WORKDIR /usr

# set environment variable that we are in production
ENV NODE_ENV production

# now we have builded the project so we copy only package.json and install them
COPY package.json ./
RUN npm install

# we copy the builded source files only and install pm2 package globally
# pm2 (production manager) will let out app run indefinitely (and som other stuff)
COPY --from=0 /usr/build/src .
RUN npm install pm2 --location=global

# start the application
CMD ["pm2-runtime","index.js"]
```

#### Running dockerfile locally in docker

- run command `docker build .` (you have to be in `healthcheck` folder)
- after the build you will get message like this `Successfully built df158448c3a7`
- copy the string with numbers and letters and run command `docker run -p 8082:8082 df158448c3a7` argument `-p` is to publish a port so we can it access the API from outside of the container
- now you are running the project on you machine in docker! Access the API by opening `localhost:8082/` in your browser or you can use [Postman](https://www.postman.com/)/[Insomnia](https://insomnia.rest/)

#### Docker-compose

If you want to deploy this project on your server the easiest way is to use docker-compose. It's nicely reusable and readable.

```yaml
version: '3.0'
services:
  healthcheck: # name of the service
    image: ghcr.io/matus-barta/healthcheck:latest # addres to the image in the repository
    container_name: healthcheck # name of the container
    environment: # here we setup our env vars
      - PORT=8082 # listening port
      - HOST="localhost" # listening IP address
      - ROOT_RES="true" # https://<domain>/
      - ENDPOINT_RES="false" # https://<domain>/healthcheck
      - JSON_RES="true" # response in JSON
    ports:
      - 8082:8082 # ports we will be listening on (external port : internal port)
    restart: unless-stopped # dont stop the service
    security_opt:
      - no-new-privileges:true # some security stuff not really needed
```

#### GitHub Actions

I was thinking to add part about GitHub Actions but honestly I don't understand it enough to run you thru it what it does. I based it on [Techno Tim's project LittleLink](https://github.com/techno-tim/littlelink-server/blob/master/.github/workflows/main.yml). Also good GitHub Actions explanation by [Fireship on YT](https://www.youtube.com/watch?v=eB0nUzAI7M8).

### Using the Healthcheck

To start, you will need machine running docker service. [See how to install docker on Ubuntu](https://docs.docker.com/engine/install/ubuntu/).

- For docker management I recommend Portainer. How to install [here](https://docs.portainer.io/start/install/server/docker/linux), video how to install and use [here](https://www.youtube.com/watch?v=ljDI5jykjE8).
- If you want to have the Healthcheck accessible from the internet, you will need to setup NAT on your router to forward http traffic to the container or you can use Reverse Proxy like [Nginx Proxy Manager](https://www.youtube.com/watch?v=P3imFC7GSr0).

To automatically check the Healthcheck is online, I use [Uptime-Kuma](https://www.youtube.com/watch?v=r_A5NKkAqZM) with notifications sent to Telegram (or you can use Discord and many other messaging platforms)

**Here are my Uptime-Kuma setting for the Healthcheck**
![Uptime-Kuma-Settings](/media/blog/simple-nodejs-project/uptime-kuma-settings.jpg)

## Ending thoughts

Hope you find this simple project useful for your homelab or as a way to learn how to make you own simple API. Healthcheck is not something made for real production or as example "how it should be done". No I am just development and homelab enthusiast so, if this has at least some usefulness for you, I will be super extremely happy. Enjoy your day!
