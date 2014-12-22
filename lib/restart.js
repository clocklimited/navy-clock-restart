var async = require('async')

module.exports = function createRestart(upstart) {

  function restart(context, data, callback) {
    context.emit('Restarting services...')
    async.each(
      Object.keys(data.services)
    , function (service, eachCallback) {
        var serviceName =  'node-' + data.client + '-' + context.appId + '-' + data.environment + '-' + service
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
          upstart.status(service, function (error, currentPid) {
            waterCallback(error, currentPid)
          })
        }
      , function (currentPid, waterCallback) {
          if (currentPid) {
            context.emit(service + ' is currrently running on pid ' + currentPid + '. Restarting...')
            upstart.stop(service, function (error, newPid) {
              if (newPid) {
                context.emit(service + ' has NOT restarted')
                waterCallback(error, newPid)
              } else {
                upstart.start(service, function (error, newPid) {
                  context.emit(service + ' has restarted and is now running on pid ' + newPid)
                  waterCallback(error, newPid)
                })
              }
            })
          } else if (force) {
            context.emit(service + ' is not currrently running. Force starting...')
            upstart.start(service, function (error, newPid) {
              context.emit(service + ' has started and is now running on pid ' + newPid)
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
