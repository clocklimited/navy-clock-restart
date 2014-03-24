# Clock Restart Order

This is an Order which is used by [Captains](http://github.com/microadam/navy-captain) as part of the Navy deployment suite.

It does the following actions:

* Restart the applications services

This order assumes that the following configuration keys have been added to the [Admiral](http://github.com/microadam/navy-admiral) for the application you are trying to prepare:

* services: Array of services that this application has. These form the suffix of the name of the upstart jobs e.g node-myproject-staging-<service>

An example [Admiral](http://github.com/microadam/navy-admiral) application configuration might look like:

    { name: 'My Application'
    , appId: 'myApp'
    , services: [ 'admin', 'api', 'site' ]
    }
