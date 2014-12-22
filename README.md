# Clock Restart Order

This is an Order which is used by [Captains](http://github.com/microadam/navy-captain) as part of the Navy deployment suite.

It does the following actions:

* Restart the applications services by issuing a stop and then a start. Only restarts the running services unless a force parameter is passed

This order assumes that the following configuration keys have been added to the [Admiral](http://github.com/microadam/navy-admiral) for the application you are trying to prepare:

* client: Shortname of the client this project belongs to
* services: Object containing thes services that this application has. The key forms the suffix of the name of the upstart jobs e.g node-myproject-staging-<-service->. The value is the relative path to the start script of the service

An example [Admiral](http://github.com/microadam/navy-admiral) application configuration might look like:

    { "name": "My Application"
    , "appId": "myApp"
    , "client": "client"
    , "services":
      { "admin": "admin/app.js"
      , "site": "site/app.js"
      , "api": "api/app.js"
      , "message-bus": "message-bus.js"
      }
    }

