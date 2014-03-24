var createRestart = require('./lib/restart')
  , upstart = require('./lib/upstart')()
  , restart = createRestart(upstart)

module.exports = function clockRestart() {

  var steps =
  { init: init
  , restart: restart
  }

  function getSteps() {
    return steps
  }

  function getStepList() {
    return Object.keys(steps)
  }

  function init(context, callback) {
    var data =
          { environment: context.orderArgs[0]
          , forceStart: context.orderArgs[1] === 'force'
          , services: context.appData.services
          }

    callback(null, data)
  }

  return {
    getSteps: getSteps
  , getStepList: getStepList
  }

}
