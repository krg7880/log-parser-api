# Introduction

Simple application to parse an error log file to aggregate total errors produced by instances of a replicated application as well as total number of errors per replica.

## Assumptions

The application is designed with the spcified requirements and some additional assumptions in mind:

- There's multiple applications errors in a log
- We want to target specific application
- We want to target specific instances

## Usage

Hot reloading is enabled to facilitate rapid testing and tight-feedback during development. Follow the steps below to being developing additional features:

**CI/CD**

Brings up the containers, executes the integration test and shut down.

```
make test
```

**Development**

Brings up the containers _(app & test)_ for development purposes. The code gets mounted into the contianer and the application hot-reloads to pick up changes -- same applies to the test container.

```
make dev
```

**API Only**

Bring up just the API by running the following command:

```
make up
```

**Browser Testing**

Below are endpoints that you can test via your browser. Note that you may need to change the port if `3000` is already allocated on your machine.

- [All application errors](http://localhost:3000/errors/)
- [Application specific errors](http://localhost:3000/errors/api-gateway/)
- [Instance specific errors](http://localhost:3000/errors/api-gateway/ffd3082fe09d)
- [OpenAPI Editor](http://localhost:3000)

**Shutting down**

To kill the running containers, run:

```
make down
```

## API Validation

Validating and testing API payload request and responses is done via OpenAPI 3 specification. See `api.yaml` to better understand the API contract.
