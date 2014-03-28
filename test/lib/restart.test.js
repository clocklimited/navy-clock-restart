var sinon = require('sinon')
  , upstart = require('../../lib/upstart')()
  , createRestart = require('../../lib/restart')

describe('restart', function () {

  it('should restart all services successfully when all are running', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, appId: 'myapp' }
      , data =
          { environment: 'staging'
          , services:
            { api: ''
            , admin: ''
            , site: ''
            }
          }
      , statusStub = sinon.stub(upstart, 'status')
      , stopStub = sinon.stub(upstart, 'stop')
      , startStub = sinon.stub(upstart, 'start')
      , restart = createRestart(upstart)

    statusStub.callsArgWith(1, null, 1)
    stopStub.callsArgWith(1, null, false)
    startStub.callsArgWith(1, null, 1)

    restart(context, data, function () {
      emitSpy.callCount.should.equal(7)
      statusStub.calledThrice.should.equal(true)
      stopStub.calledThrice.should.equal(true)
      startStub.calledThrice.should.equal(true)

      statusStub.restore()
      stopStub.restore()
      startStub.restore()

      done()
    })
  })

  it('should restart all but one non running service', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, appId: 'myapp' }
      , data =
          { environment: 'staging'
          , services:
            { api: ''
            , admin: ''
            , site: ''
            }
          }
      , statusStub = sinon.stub(upstart, 'status')
      , stopStub = sinon.stub(upstart, 'stop')
      , startStub = sinon.stub(upstart, 'start')
      , restart = createRestart(upstart)

    statusStub.callsArgWith(1, null, 1)
    statusStub.onFirstCall().callsArgWith(1, null, null)
    stopStub.callsArgWith(1, null, false)
    startStub.callsArgWith(1, null, 2)

    restart(context, data, function () {
      emitSpy.callCount.should.equal(6)
      statusStub.calledThrice.should.equal(true)
      stopStub.calledTwice.should.equal(true)
      startStub.calledTwice.should.equal(true)

      statusStub.restore()
      stopStub.restore()
      startStub.restore()

      done()
    })
  })

  it('should restart all services even if they arent running when force is set', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, appId: 'myapp' }
      , data =
          { environment: 'staging'
          , services:
            { api: ''
            , admin: ''
            , site: ''
            }
          , forceStart: true
          }
      , statusStub = sinon.stub(upstart, 'status')
      , stopStub = sinon.stub(upstart, 'stop')
      , startStub = sinon.stub(upstart, 'start')
      , restart = createRestart(upstart)

    statusStub.callsArgWith(1, null, 1)
    statusStub.onFirstCall().callsArgWith(1, null, null)
    stopStub.callsArgWith(1, null, false)
    startStub.callsArgWith(1, null, 2)

    restart(context, data, function () {
      emitSpy.callCount.should.equal(7)
      statusStub.calledThrice.should.equal(true)
      stopStub.calledTwice.should.equal(true)
      startStub.calledThrice.should.equal(true)

      statusStub.restore()
      stopStub.restore()
      startStub.restore()

      done()
    })
  })

  it('should should not start service if it cannot be stopped', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, appId: 'myapp' }
      , data =
          { environment: 'staging'
          , services:
            { api: ''
            }
          }
      , statusStub = sinon.stub(upstart, 'status')
      , stopStub = sinon.stub(upstart, 'stop')
      , startStub = sinon.stub(upstart, 'start')
      , restart = createRestart(upstart)

    statusStub.callsArgWith(1, null, 1)
    stopStub.callsArgWith(1, null, 1)

    restart(context, data, function () {
      emitSpy.callCount.should.equal(3)
      statusStub.calledOnce.should.equal(true)
      stopStub.calledOnce.should.equal(true)
      startStub.callCount.should.equal(0)

      statusStub.restore()
      stopStub.restore()
      startStub.restore()

      done()
    })
  })

})
