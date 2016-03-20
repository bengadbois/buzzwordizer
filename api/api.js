var express = require('express');
var bodyParser = require('body-parser')
var bunyan = require('bunyan');

var argv = require('yargs')
  .option('p', { alias: 'port', demand: false, describe: 'Port', default: 8080, type: 'string'})
  .option('l', { alias: 'log', demand: false, describe: 'Logfile', default: '/var/tmp/api_out.log', type: 'string'})
  .option('e', { alias: 'err', demand: false, describe: 'Errfile', default: '/var/tmp/api_err.log', type: 'string'})
  .help('?')
  .alias('?', 'h')
  .alias('?', 'help')
  .argv;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

//assign based on passed args
var port = argv.p;
var logfile = argv.l;
var errfile = argv.e;

var log = bunyan.createLogger({
  name: 'api',
  streams: [
    {
      level: 'info',
      path: logfile // log INFO and above to a file
    },
    {
      level: 'error',
      path: errfile // log ERROR and above to a file
    }
  ]
});

//catch errors
app.use(function(err,req,res,next){
  if(err){
    log.error(err);
    res.send(500, 'An error occurred')
  }
});

var buzzwordReplacements = {
  //webscale
  'large': 'webscale',
  'huge': 'webscale',
  'gigantic': 'webscale',
  'massive': 'webscale',
  'immense': 'webscale',
  'efficient': 'webscale',
  'optimal': 'webscale',

  //app
  'software': 'app',
  'application': 'app',
  'program': 'app',
  'system': 'app',

  //cloud
  'back end': 'cloud',
  'back-end': 'cloud',
  'backend': 'cloud',
  'servers': 'cloud',
  'server side': 'cloud',
  'server-side': 'cloud',
  'serverside': 'cloud',
  'data center': 'cloud',
  'datacenter': 'cloud',
  'internet': 'cloud',

  //specific software
  'php': 'NodeJS',
  'python': 'NodeJS',
  'java': 'Go',
  'jquery': 'React',
  'svn': 'Git',
  'subversion': 'Git',
  'html': 'HTML5',
  'CSS': 'SASS',
  'LAMP': 'MEAN',
  'apache': 'Nginx',
  'mysql': 'MongoDB',
  'database': 'NoSQL',

  //containers
  //TODO docker and stuff
  
  //employee
  'software engineer': 'data scientist',
  'software engineer': 'software developer',
  'programmer': 'developer',
  'programmer': 'coder',
  'developer': 'hacker',
  'developer': 'coder',
  'employee': 'team player',
  'employee': 'full stack employee',
  'fun': 'social',

  //web
  'web ': 'responsive web ',
  'website ': 'responsive website ',
  
  //devops
  'IT': 'DevOps',
  'information technology': 'DevOps',
  'reliable': 'always on',

  //startup
  'startup': 'unicorn startup',

  //microservice
  'service': 'microservice',
  'module': 'microservice',

  //misc
  'fast': 'high performance',
  'install': 'deploy',
  'installation': 'deployment',
  'smart': 'innovative',
  'waterfall': 'agile',
  'software development' : 'continuous integration'
}

var aAnGrammarFixReplacements = {
  ' an cloud': ' a cloud',
  ' a app': ' an app',
  ' an devops': ' a DevOPs',
  ' a always on': ' an always on',
  ' a agile': ' an agile',
  ' a employee': ' an employee',
  ' a innovative': ' an innovative',
  ' an deploy': ' a deploy'
}

app.get('/', function(req, res) {
  log.info(req);
  res.send('Usage: POST with input=somethingsomething as params or {"input": "something something"} with the JSON header\n');
});

app.post('/', function(req, res) {
  log.info(req);

  //get the input, given whatever they provided it as
  if (typeof req.body.input !== 'undefined')
    var input = req.body.input;
  else if (typeof req.body.Input !== 'undefined')
    var input = req.body.Input;
  else if (typeof req.body.INPUT !== 'undefined')
    var input = req.body.INPUT;

  var output = input;

  //replace with buzzwords
  var chanceOfReplacement = 0.6;
  for (var key in buzzwordReplacements) {
    if (Math.random() > chanceOfReplacement){
      continue;
    }
    var regex = new RegExp(key, 'i');
    output = output.replace(regex, buzzwordReplacements[key]);
  }

  //fix grammar
  for (var key in aAnGrammarFixReplacements) {
    var regex = new RegExp(key, 'i');
    output = output.replace(regex, aAnGrammarFixReplacements[key]);
  }

  //capitalize start of all sentences
  output = output.replace(/\. *([a-z])/g, function(match, match1, offset, original) { return '. ' + match1.toUpperCase(); })

  output = output.replace(/^([a-z])/g, function(match, match1, offset, original) { return match1.toUpperCase(); })

  //send response
  res.status(200).json({
    success: true,
    input: input,
    output: output
  });

});

var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("App listening at http://%s:%s", host, port)

})
