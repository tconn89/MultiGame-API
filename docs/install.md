# Installation

Docker should be doing most of the heavy lifting for this part.

You'll see in the [Dockerfile](../Dockerfile) that `npm install` is run.  Here is a list of the current node modules
as of 8/01/17.
Use `npm ls --depth=0`

async@2.3.0
axios@0.15.3 extraneous
body-parser@1.15.2
chai@1.8.1
chai-fs@1.0.0
chai-http@3.0.0
connect-flash@0.1.1
cookie-parser@1.4.3
crypto@0.0.3
database-cleaner@1.2.0
debug@2.3.3
express@4.14.0
express-session@1.14.2
factory-girl@4.2.2
formidable@1.0.17
jade@1.11.0
mailgun-js@0.10.1 extraneous
mocha@1.14.0
mongoose@4.6.7
mongoose-auto-increment@5.0.1
morgan@1.7.0
nodemailer@4.0.1
nodemailer-mailgun-transport@1.3.4
passport@0.2.2
passport-local@1.0.0
passport-local-mongoose@1.3.0
passport-localapikey@0.0.3
redis@2.6.3 extraneous
redis-server@1.0.0 extraneous
response-time@2.3.2 extraneous
serve-favicon@2.3.0
should@2.1.1

As well as global dependencies.  See `npm ls -g --depth=0`

forever@0.15.3
npm@4.0.5
