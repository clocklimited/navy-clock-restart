var async = require('async')

module.exports = function createRestart(upstart) {

  function restart(context, data, callback) {
    context.emit('Restarting services...')
    async.each(
      data.services
    , function (service, eachCallback) {
        var serviceName =  'node-' + context.appId + '-' + data.environment + '-' + service
        restartSingleService(serviceName, context, data.forceStart, eachCallback)
      }
    , function (error) {
        callback(error, data)
      }
    )
  }

  function restartSingleService(service, context, force, callback) {
    async.waterfall
    ( [ function (waterCallback) {
          upstart.status(service, function (error, name, currentPid) {
            waterCallback(error, currentPid)
          })
        }
      , function (currentPid, waterCallback) {
          if (currentPid || force) {
            context.emit(service + ' is currrently running on pid ' + currentPid + '. Restarting...')
            upstart.restart(service, function (error, name, newPid) {
              context.emit(service + ' has restarted and is now running on pid ' + newPid)
              waterCallback(error, newPid)
            })
          } else {
            context.emit(service + ' is not currrently running. Not restarting')
            waterCallback(null)
          }
        }
      ]
    , callback
    )
  }

  return restart
}
