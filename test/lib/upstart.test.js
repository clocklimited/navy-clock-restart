var should = require('should')
  , rewire = require('rewire')
  , createUpstart = rewire('../../lib/upstart')

describe('upstart', function () {

  function testRunningService(cmd, callback) {

    function exec(c, callback) {
      callback(null, 'node-striderbot start/running, process 23313\n')
    }

    createUpstart.__set__('exec', exec)
    var upstart = createUpstart()
    upstart[cmd]('test', function (error, pid) {
      should.not.exist(error)
      pid.should.equal('23313')
      callback()
    })
  }

  it('should execute status', function (done) {
    testRunningService('status', done)
  })

  it('should execute start', function (done) {
    testRunningService('start', done)
  })

  it('should execute restart', function (done) {
    testRunningService('restart', done)
  })

  it('should execute status when service is not running', function (done) {

    function exec(c, callback) {
      callback(null, 'node-striderbot stop/waiting')
    }

    createUpstart.__set__('exec', exec)
    var upstart = createUpstart()
    upstart.status('test', function (error, pid) {
      should.not.exist(error)
      pid.should.equal(false)
      done()
    })
  })

})
