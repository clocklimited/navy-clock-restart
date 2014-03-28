var cp = require('child_process')
  , exec = cp.exec

module.exports = function createUpstart() {

  function status(service, callback) {
    runExec('status', service, callback)
  }

  function start(service, callback) {
    runExec('start', service, callback)
  }

  function stop(service, callback) {
    runExec('stop', service, callback)
  }

  function restart(service, callback) {
    runExec('restart', service, callback)
  }

  function getPid(output) {
    var parts = output.split(' ')
      , pid = false

    if (parts[3]) {
      pid = parts[3]
      pid = pid.replace('\n', '')
    }

    return pid
  }

  function runExec(cmd, service, callback) {
    exec('sudo ' + cmd + ' ' + service, function (error, stdout) {
      callback(error, getPid(stdout))
    })
  }

  return {
    status: status
  , start: start
  , stop: stop
  , restart: restart
  }

}
