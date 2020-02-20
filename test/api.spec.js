const assert = require('chai').assert
const fetch = require('node-fetch')

describe('API', () => {
  describe('/errors', () => {
    it('should return all apps and all instances of all apps', async () => {
      const res = await fetch('http://api:3000/errors/')
      const json = await res.json()
      const {
        status,
        data
      } = json

      assert.equal(status, 'success', 'should be success status')
      assert.isArray(data, 'data should be an array')
      assert.lengthOf(data, 1, 'should only include data for 1 application')
    })
  })

  describe('/errors/<applicationId>', () => {
    it('should return just applicationId: <foo>', async () => {
      const res = await fetch('http://api:3000/errors/api-gateway')
      const json = await res.json()
      const {
        status,
        data
      } = json

      assert.equal(status, 'success', 'should be success status')
      assert.isObject(data, 'data should be an object')

      const {
        applicationId,
        totalErrors,
        instances
      } = data

      assert.equal(applicationId, 'api-gateway', 'applicationId should be api-gateway')
      assert.strictEqual(totalErrors, 17, 'should have 17 total errors')
      assert.lengthOf(instances, 1, 'should have a single application instance')

      const [{
        instanceId,
        totalErrors: instanceTotalErrors
      }] = instances

      assert.equal(instanceId, 'ffd3082fe09d', 'instanceId should be ffd3082fe09d')
      assert.strictEqual(instanceTotalErrors, 17, 'should have 17 total instance errors')
    })
  })

  describe('/errors/<applicationId>/<instanceId>', () => {
    it('should return just instanceId <bar>', async () => {
      const res = await fetch('http://api:3000/errors/api-gateway/ffd3082fe09d')
      const json = await res.json()
      const {
        status,
        data
      } = json

      assert.equal(status, 'success', 'should be success status')
      assert.isObject(data, 'data should be an object')

      const {
        instanceId,
        totalErrors
      } = data

      assert.equal(instanceId, 'ffd3082fe09d', 'instanceId should be ffd3082fe09d')
      assert.strictEqual(totalErrors, 17, 'should have 17 total instance errors')
    })
  })
})
