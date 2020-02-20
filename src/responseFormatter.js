/**
 * Formats the response payload for all applications that logged errors
 *
 * @param {Object<AppError>} errors Object of application errors
 * @return {Array<Object>}
 */
const formatErrors = (errors) => {
  if (!errors) return

  const applicationIds = Object.keys(errors)

  return applicationIds.map(applicationId => {
    const error = errors[applicationId]
    const {
      instances: instanceErrors,
      errors: totalErrors
    } = error

    const instances = Object.keys(instanceErrors).map(instanceId => {
      return {
        instanceId,
        totalErrors: instanceErrors[instanceId]
      }
    })

    return {
      applicationId,
      totalErrors,
      instances
    }
  })
}

/**
 * Formats the response payload for a given application that generated errors
 *
 * @param {string} appId Application ID to filter on
 * @param {Object<AppError>} errors Object of parsed application errors
 * @return {Array<Object>}
 */
const formatApplicationErrors = (appId, errors) => {
  const allErrors = formatErrors(errors)
  if (!allErrors) return

  return allErrors.filter(({
    applicationId
  }) => applicationId === appId)
}

/**
 * Formats the response payload for a given application instance that generated
 * errors.
 *
 * @param {string} appId Application ID to filter on
 * @param {string} instanceId The instance ID to filter on
 * @param {Object<AppError>} errors Object of parsed application errors
 * @return {Array<Object>}
 */
const formatInstanceErrors = (appId, instanceId, errors) => {
  const applicationErrors = formatApplicationErrors(appId, errors)
  if (!applicationErrors) return

  const [applicationError] = applicationErrors

  return applicationError.instances.filter(({
    instanceId: id
  }) => instanceId === id)
}

module.exports = {
  formatErrors,
  formatApplicationErrors,
  formatInstanceErrors
}
