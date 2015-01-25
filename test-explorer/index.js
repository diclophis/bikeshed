// TODO: When an error occurs, log it and exit
//process.on('uncaughtException', function handleErr (err) {
//  throw err;
//});

// Load in dependencies
var fs = require('fs');
var NWGui = require('nw.gui');
var Cucumber = require('cucumber');
var ansispan = require('./ansispan');
var util = require('./util')
var dirname = util.dirname;
var nwglBridge = require('./nwgl_bridge');

// Grab the arguments
var projectDirectory = NWGui.App.argv[0];
var url = "http://google.com/";

var re1='((?:[a-z]*))';  // Word 1
var filler='.*?';  // Non-greedy match on filler
var re3='([a-z])';  // Any Single Word Character (Not Whitespace) 1
var re4='.*?';  // Non-greedy match on filler
var simpleWord='([a-z]*)';  // Word 2
var re6='.*?';  // Non-greedy match on filler
var re7='((?:http|https)(?::\\/{2}[\\w]+)(?:[\\/|\\.]?)(?:[^\\s"]*))';  // HTTP URL 1

//var authenticationTokens = new RegExp("I" + filler + "am" + filler + "authenticated" + filler + "as" + filler + simpleWord, ["i"]);
var authenticationTokens = new RegExp(".*authenticated.*as\ (.*)", ["i"]);
var needToOpenUrl = new RegExp(".*visit\ (.*)", ["i"]);
//var browserResolution = new RegExp(".*resolution.*is\ (.*)", ["i"]);
var followingUsers = new RegExp(".*the.*following.*users.*exist", ["i"]);
var followingBrowserResolution = new RegExp(".*my.*browser.*resolution.*is.*", ["i"]);
var cssSelectorShouldBePresent = new RegExp(".*should.*see\ (.*)", ["i"]);

/////
var leftImg = null;
var rightImg = null;
var canvasC = false;

leftImg = document.getElementById("img-0");
rightImg = document.getElementById("img-1");
canvasC = document.getElementById("webgl-container");

var vertexS = document.getElementById("vertex-0").innerHTML;
var fragmentS = document.getElementById("fragment-0").innerHTML;

window.focus();


var shedFileOpened = function(err, fd) {
  if (err) throw err;

  var featureSource = fd.toString();

  var worldCount = 0;

  var extendedSupportCode = require(projectDirectory + '/features/step_definitions');

  console.log("EXTEND?", extendedSupportCode);

  var supportCode = function() {
    this.World = function(callback) {
      console.log(this.bar, "Make World: " + worldCount);
      callback({foo: 'bar' + worldCount++});
    };

    extendedSupportCode.call(this);


    this.Given(followingUsers, function(tokens, callback) {
      console.log(this.foo, "users: " + tokens.hashes());
      callback(false); // return presence of errors
    });

    this.Given(followingBrowserResolution, function(tokens, callback) {
      console.log(this.foo, "resolutions: " + tokens.hashes());
      callback(false); // return presence of errors
    });

    //this.Given(browserResolution, function(tokens, callback) {
    //  console.log(this.foo, "res: " + tokens);
    //  callback();
    //});

    this.Given(authenticationTokens, function(tokens, callback) {
      console.log(this.foo, "tokens: " + tokens);
      callback();
    });

    this.When(needToOpenUrl, function(url, callback) {
      console.log(this.foo, "when: " + url);
      //guiWin.win.location = url;
      //(explorerWindow, url, canvasC, leftImg, rightImg, vertexSource, fragmentSource)
      //debugger;
      var guiWidth = 512;
      var guiHeight = 512;

      // var win = gui.Window.open('http://google.com/', {
      var guiWin = NWGui.Window.open(url, {
        width: guiWidth,
        height: guiHeight,
        focus: false,
        frame: true,
        toolbar: true,
        show: true
      });

      nwglBridge(window, guiWin, canvasC, leftImg, rightImg, vertexS, fragmentS);

      callback.pending();
    });

    this.Then(cssSelectorShouldBePresent, function(cssSelector, callback) {
      console.log(this.foo, "css: " + cssSelector);
      var foundSelector = guiWin.win.document.querySelector(cssSelect);
      console.log(foundSelector);

      callback("error");
    });
  };

  var cucumber = Cucumber(featureSource, supportCode);
        var options = {logToConsole: false, coffeeScriptSnippets: false, snippets: false};
        var formatter = Cucumber.Listener.PrettyFormatter(options);
        //var formatter = Cucumber.Listener.SummaryFormatter(options);
        //var formatter = Cucumber.Listener.ProgressFormatter(options);

  cucumber.attachListener(formatter);

  cucumber.start(function() {
    //console.log("finished cucumber", cucumber);
    var p = document.createElement('pre');
    //console.log("finished" + ansispan(formatter.getLogs()));
    p.innerHTML = ansispan(formatter.getLogs());
    document.body.appendChild(p);
  });

};

window.boot = function() {

  console.log('nw directory: ' + process.cwd(), dirname, projectDirectory + "/Shedfile");

  fs.readFile(projectDirectory + "/Shedfile", shedFileOpened);
};

window.addEventListener('load', function() {
  boot();
});
