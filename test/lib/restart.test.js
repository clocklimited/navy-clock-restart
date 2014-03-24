var sinon = require('sinon')
  , upstart = require('upstart')
  , createRestart = require('../../lib/restart')

describe('restart', function () {

  it('should restart all services successfully when all are running', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, appId: 'myapp' }
      , data =
          { environment: 'staging'
          , services: [ 'api', 'admin', 'site' ]
          }
      , statusStub = sinon.stub(upstart, 'status')
      , restartStub = sinon.stub(upstart, 'restart')
      , restart = createRestart(upstart)

    statusStub.callsArgWith(1, null, null, 1)
    restartStub.callsArgWith(1, null, null, 2)

    restart(context, data, function () {
      emitSpy.callCount.should.equal(7)
      statusStub.calledThrice.should.equal(true)
      restartStub.calledThrice.should.equal(true)

      statusStub.restore()
      restartStub.restore()

      done()
    })
  })

  it('should restart all but one non running service', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, appId: 'myapp' }
      , data =
          { environment: 'staging'
          , services: [ 'api', 'admin', 'site' ]
          }
      , statusStub = sinon.stub(upstart, 'status')
      , restartStub = sinon.stub(upstart, 'restart')
      , restart = createRestart(upstart)

    statusStub.callsArgWith(1, null, null, 1)
    statusStub.onFirstCall().callsArgWith(1, null, null, null)
    restartStub.callsArgWith(1, null, null, 2)

    restart(context, data, function () {
      emitSpy.callCount.should.equal(6)
      statusStub.calledThrice.should.equal(true)
      restartStub.calledTwice.should.equal(true)

      statusStub.restore()
      restartStub.restore()

      done()
    })
  })

  it('should restart all services even if they arent running when force is set', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, appId: 'myapp' }
      , data =
          { environment: 'staging'
          , services: [ 'api', 'admin', 'site' ]
          , forceStart: true
          }
      , statusStub = sinon.stub(upstart, 'status')
      , restartStub = sinon.stub(upstart, 'restart')
      , restart = createRestart(upstart)

    statusStub.callsArgWith(1, null, null, 1)
    statusStub.onFirstCall().callsArgWith(1, null, null, null)
    restartStub.callsArgWith(1, null, null, 2)

    restart(context, data, function () {
      emitSpy.callCount.should.equal(7)
      statusStub.calledThrice.should.equal(true)
      restartStub.calledThrice.should.equal(true)

      statusStub.restore()
      restartStub.restore()

      done()
    })
  })

})
