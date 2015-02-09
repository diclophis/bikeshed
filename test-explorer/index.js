// TODO: When an error occurs, log it and exit
//process.on('uncaughtException', function handleErr (err) {
//  throw err;
//});

// Load in dependencies
var fs = require('fs');
var NWGui = require('nw.gui');
var Cucumber = require('cucumber');

var Promise = require("bluebird");
Promise.onPossiblyUnhandledRejection(function(error){
  throw error;
});

var ansispan = require('./ansispan');
var util = require('./util')
var dirname = util.dirname;
var nwglBridge = require('./nwgl_bridge');
var slugify = require('./slug');
var supportCodeMaker = require('./support-code');


// Grab the arguments
var projectDirectory = NWGui.App.argv[0];
var extendedSupportCode = require(projectDirectory + '/features/step_definitions');

var vertexS = document.getElementById("vertex-0").innerHTML;
var fragmentS = document.getElementById("fragment-0").innerHTML;

var runCucumberOnShedfile = Promise.promisify(function(featureSource, callbackWhenDoneWithCucumber) {

  // initialize cucumber with given feature gherkin source, and extended support code class
  var cucumber = new Cucumber(featureSource, supportCodeMaker(extendedSupportCode));

  // TODO: better listener for rendering results
  var options = {logToConsole: false, coffeeScriptSnippets: false, snippets: true};
  var formatter = new Cucumber.Listener.PrettyFormatter(options);
  var formatter = new Cucumber.Listener.SummaryFormatter(options);
  var formatter = new Cucumber.Listener.ProgressFormatter(options);

  cucumber.attachListener(formatter);

  cucumber.start(function() {
    callbackWhenDoneWithCucumber(false, formatter);
  });
});

var shedFileOpened = function(err, fd) {
  if (err) throw err;

  var featureSource = fd.toString();

  runCucumberOnShedfile(featureSource).then(function(formatter) {
    var p = document.createElement('pre');
    p.innerHTML = ansispan(formatter.getLogs());
    document.body.appendChild(p);
  });
};

var boot = function() {
  //console.log('nw directory: ' + process.cwd(), dirname, projectDirectory + "/Shedfile");
  NWGui.Window.get().showDevTools();
  window.focus();

  fs.readFile(projectDirectory + "/Shedfile", shedFileOpened);
};

window.addEventListener('load', function() {
  boot();
});
