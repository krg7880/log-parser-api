const fs = require('fs')
const eventStream = require('event-stream')
const reduce = require('stream-reduce')
const AppError = require('./appError')
const lineMatcherRegexp = /([^\s]+)\s?\[([^\s]+)\s?([^\s]+)\]([^\r\n]+)/

/**
 * Checks if the current line is the beginning of an error
 *
 * @param {string} line Line to check
 */
const isError = (line) => /\[error\]/.test(line)

/**
 * Process each line of the log file
 *
 * @param {Object<AppError>} errors Mappings of application errors
 * @param {string} line A line in the log file to process
 */
const processLine = (errors, line) => {
  if (!line) return errors
  if (!isError(line)) return errors

  const matches = lineMatcherRegexp.exec(line)
  if (matches.length < 5) return

  const [, , appId, instanceId] = matches

  if (!errors[appId]) {
    errors[appId] = new AppError(appId)
  }

  errors[appId].incrementInstance(instanceId)

  return errors
}

/**
 *
 * @param {string} filePath Path to log file to process
 */
const processLogFile = (filePath) => {
  return new Promise((resolve) => {
    fs.createReadStream(filePath, {
        flags: 'r'
      })
      .pipe(eventStream.split())
      .pipe(reduce(processLine, {}))
      .on('data', (errors) => {
        if (errors) {
          return resolve(errors)
        }

        reject()
      })
  })
}


module.exports = {
  processLogFile
}
