var should = require('should')
  , assert = require('assert')
  , clockRestart = require('../index')()

describe('clock-restart', function () {

  it('should return steps', function () {
    var steps = clockRestart.getSteps()
    assert.equal(typeof steps.init, 'function')
    assert.equal(typeof steps.restart, 'function')
  })

  it('should return steps list', function () {
    var stepList = clockRestart.getStepList()
    stepList.length.should.equal(2)
    stepList[0].should.equal('init')
    stepList[1].should.equal('restart')
  })

  it('should run the init function', function (done) {
    var steps = clockRestart.getSteps()
      , context =
        { appId: 'myapp'
        , environment: 'staging'
        , orderArgs: [ ]
        , appData: { services: [ 'site', 'admin', 'api' ] }
        }

    steps.init(context, function (error, data) {
      should.not.exist(error)
      Object.keys(data).length.should.equal(3)
      data.environment.should.equal(context.environment)
      data.services.length.should.equal(context.appData.services.length)
      data.forceStart.should.equal(false)
      done()
    })
  })

})
