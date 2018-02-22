# Configuration
This doc covers configuration of 3rd party services.  All server paths should assume an absolute path of `/var/www/node_server`

## MailGun
In the [routes file](../routes/index.js) we have an api key that must be copied from your [mailgun account](https://www.mailgun.com/).  The domain can also be supplied to and must be verified through Mailgun as well.

Configurations for email options can be seen in the mailOptions variable, exemplified in the `/forgot` endpoint.

## Forever
Forever is a daemon utility that runs this node server in the background.

start the server
`FOREVER_ROOT=/var/www/node_server forever start bin/server.js`

stop the server
`FOREVER_ROOT=/var/www/node_server forever stop bin/server.js`

Forever config location: 
`config.json`


## Mongo Configuration
mongodb config location:
`mongo.conf`
