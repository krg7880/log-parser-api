const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const pino = require('koa-pino-logger')()
const {
  formatErrors,
  formatApplicationErrors,
  formatInstanceErrors
} = require('./responseFormatter')

const {
  oas
} = require('koa-oas3')

const {
  processLogFile
} = require('./fileProcessor')

const {
  LOG_FILE: logFile = `${__dirname}/../error_log.txt`
} = process.env

const app = new Koa()
const router = new Router()

app.use(pino)
app.use(bodyParser())
app.use(oas({
  file: `${__dirname}/../api.yaml`,
  endpoint: '/api.json',
  uiEndpoint: '/',
  validateResponse: true,
  errorHandler: (error, ctx) => {
    const {
      message,
      meta: {
        rawErrors: [{
          error: suggestion // probably shouldn't surface this :shrug:
        }]
      }
    } = error

    ctx.status = 400
    ctx.body = {
      status: 'error',
      data: `${message} - ${suggestion}`
    }
  }
}))

/**
 * Prints the error report
 *
 * @param {Object<AppError>} errors
 */
const reportErrors = (errors) => {
  for (const appName in errors) {
    const error = errors[appName]
    const report = error.report()
    console.log("\r\n==== Summary ====\r\n", report.join("\r\n"), "\r\n")
  }
}

// get all errors
// @example: http://localhost:3000/errors
router.get('/errors', async (ctx) => {
  ctx.log.info('Fetching all errors')

  const results = await processLogFile(logFile)

  // log to stdout
  reportErrors(results)

  const allErrors = formatErrors(results)

  ctx.status = 200
  ctx.body = {
    status: 'success',
    data: allErrors || []
  }
})

// get all errors specific to an app
// @example: http://localhost:3000/errors/api-gateway
router.get('/errors/:appId', async (ctx) => {
  ctx.log.info('fetching application errors')

  const {
    appId
  } = ctx.params

  const results = await processLogFile(logFile)

  // log to stdout
  reportErrors(results)

  const [applicationErrors] = formatApplicationErrors(appId, results)

  ctx.status = 200
  ctx.body = {
    status: 'success',
    data: applicationErrors || {}
  }
})

// get all errors specific to an instance of an app
// @example: http://localhost:3000/errors/api-gateway/ffd3082fe09d
router.get('/errors/:appId/:instanceId', async (ctx) => {
  ctx.log.info('fetching instance errors')

  const {
    appId,
    instanceId
  } = ctx.params

  const results = await processLogFile(logFile)

  // log to stdout
  reportErrors(results)

  const [instanceErrors] = formatInstanceErrors(appId, instanceId, results)

  ctx.status = 200
  ctx.body = {
    status: 'success',
    data: instanceErrors || {}
  }
})

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000)
