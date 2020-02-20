/**
 * Encapsulates the errors associated with a given `App` as well as instances
 * of said `App`. We assume a finite number of `App`s and therefore the cost
 * of creating a new object to record its errors should be cheap.
 *
 * @class
 */
class AppError {
  /**
   * Creates a new `AppError` instance
   *
   * @param {string} name Application name
   */
  constructor(name) {
    this.name = name
    this.errors = 0
    this.instances = {}
  }

  /**
   * Increments the total application errors by 1
   *
   * @private
   */
  _increment() {
    this.errors += 1
  }

  /**
   * Increments the total number of errors on an instance
   *
   * @param {} instanceId
   */
  incrementInstance(instanceId) {
    this._increment()
    if (!this.instances[instanceId]) {
      this.instances[instanceId] = 1
      return
    }

    this.instances[instanceId] += 1
  }

  /**
   * Returns an array with error report for the app and all instances of the app
   *
   * @returns {Array<string>} [appError, ...instanceErrors]
   */
  report() {
    const errors = [`[${this.name}]: ${this.errors}`]
    return Object.keys(this.instances).reduce((errors, instanceName) => {
      const instanceTotal = this.instances[instanceName]
      const error = `[${instanceName}]: ${instanceTotal}/${this.errors}`
      errors.push(error)
      return errors
    }, errors)
  }
}

module.exports = AppError
