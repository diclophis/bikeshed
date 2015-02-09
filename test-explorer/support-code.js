// something

var Promise = require("bluebird");
var NWGui = require('nw.gui');

var openWindow = Promise.promisify(function(url, callbackWhenWindowLoaded) {
/*
  var leftImg = null;
  var rightImg = null;
  var canvasC = false;
*/

  var guiWidth = 512;
  var guiHeight = 512;

  var guiWin = NWGui.Window.open(url, {
    width: guiWidth,
    height: guiHeight,
    focus: false,
    frame: true,
    toolbar: true,
    show: true
  });

  guiWin.on('loaded', function() {
    callbackWhenWindowLoaded(false, null);
  });

/*
  leftImg = document.createElement("img");
  rightImg = document.createElement("img");
  canvasC = document.createElement("canvas");

  canvasC.width = leftImg.width = rightImg.width = guiWidth;
  canvasC.height = leftImg.height = rightImg.height = guiHeight;

  //this.lastBridge = nwglBridge(window, this.guiWin, canvasC, leftImg, rightImg, vertexS, fragmentS, callbackWhenWindowLoaded);

  leftImg.src = rightImg.src = "cyan.jpg";

  document.body.appendChild(canvasC);
  document.body.appendChild(leftImg);
  document.body.appendChild(rightImg);
*/

  
});

module.exports = function(extendedSupportCode) {
  return (function() {

    var phase = null;

    var url = "http://google.com/";

    var re1='((?:[a-z]*))';  // Word 1
    var filler='.*?';  // Non-greedy match on filler
    var re3='([a-z])';  // Any Single Word Character (Not Whitespace) 1
    var re4='.*?';  // Non-greedy match on filler
    var simpleWord='([a-z]*)';  // Word 2
    var re6='.*?';  // Non-greedy match on filler
    var re7='((?:file|http|https)(?::\\/{2}[\\w]+)(?:[\\/|\\.]?)(?:[^\\s"]*))';  // HTTP URL 1
    //var foundCss = '([#|\\.]?)([\\w|:|\\s|\\.]+)';


    //var authenticationTokens = new RegExp("I" + filler + "am" + filler + "authenticated" + filler + "as" + filler + simpleWord, ["i"]);
    var authenticationTokens = new RegExp(".*authenticated.*as\ (.*)", ["i"]);
    var needToOpenUrl = new RegExp(".*window\ (.*)", ["i"]);
    //var browserResolution = new RegExp(".*resolution.*is\ (.*)", ["i"]);
    var followingUsers = new RegExp(".*the.*following.*users.*exist", ["i"]);
    var followingBrowserResolution = new RegExp(".*my.*browser.*resolution.*is.*", ["i"]);
    var cssSelectorShouldBePresent = new RegExp(".*see\ (.*)", ["i"]);
    //console.log(cssSelectorShouldBePresent.toString());

    var worldCount = 0;
    var slugTrail = null;
    var slugs = null;

    //this.call(extendedSupportCode);
    extendedSupportCode.call(this);

    this.World = function(callback) {
      //console.log(this.bar, "Make World: " + worldCount);
      callback({
        worldIndex: worldCount++
      });
    };

  /*
      this.Given(followingUsers, function(tokens, callback) {
        //console.log(this.foo, "users: " + tokens.hashes());
        callback(false); // return presence of errors
      });

      this.Given(followingBrowserResolution, function(tokens, callback) {
        //console.log(this.foo, "resolutions: " + tokens.hashes());
        callback(false); // return presence of errors
      });

      //this.Given(browserResolution, function(tokens, callback) {
      //  console.log(this.foo, "res: " + tokens);
      //  callback();
      //});

      this.Given(authenticationTokens, function(tokens, callback) {
        //console.log(this.foo, "tokens: " + tokens);
        callback();
      });
  */

    // Given => begin loadingPhase, openWindow(url)
    this.Given(needToOpenUrl, function(url, callbackWhenGivenWindowLoaded) {
      if (null === phase) {
        phase = 0; //TODO: stateMachine
        openWindow(url).then(function(result) {
          callbackWhenGivenWindowLoaded();
        });
      }
    });

  /*
      //this.And(cssSelectorShouldBePresent, function(cssSelector, callback) {
      //});

      this.Then(cssSelectorShouldBePresent, function(cssSelector, callback) {
        //console.log(cssSelector.toString(), callback.toString());
        //console.log(this.worldIndex, "css: " + cssSelector, "guiWin: " + this.guiWin.window.document);
        //var foundSelector = this.guiWin.window.document.querySelector(cssSelector);
        //callback("error");
        //callback(!foundSelector);
        //console.log('e');
        //this.slugTrail += '-' + this.slug;
        //debugger;
        callback();
      });

      //this.Before(function (scenario, callback) {
      //  console.log("before !!!" + scenario.getName(), "(" + scenario.getUri() + ":" + scenario.getLine() + ")");
      //  callback();
      //});

      //  this.slug + '-' + 

      this.Then(/^fail$/, function (callback) {
        //this is TRUE when page FAILS to load
        //console.log('e');
        //this.slugTrail += '-' + this.slug;
        //debugger;
        callback();
      });

      this.registerHandler('BeforeFeature', function (event, callback) {
        slugs = new Array();
        slugs.push(slugify(event.getPayloadItem("feature").getName()));
        callback();
      });

      this.registerHandler('BeforeScenario', function (event, callback) {
        slugs.push(slugify(event.getPayloadItem("scenario").getName()));
        callback();
      });

      this.registerHandler('BeforeStep', function (event, callback) {
        slugs.push(slugify(event.getPayloadItem("step").getName()));
        //console.log('b', this.slug, this.slugTrail, event.getPayloadItem("step").getName());
        //debugger;
        callback();
      });

      this.registerHandler('AfterStep', function (event, callback) {
        //console.log('a', event.getPayloadItem("step").getName());
        //console.log(this.slugTrail);
        //debugger;
        callback();
      });
  */
  });
};

// And => waitFor(cssSelector)
// When => begin interactivePhase, triggerEvent(eventName, cssSelector) => inherent waitFor(cssSelector)
// And => waitForSelector, (optional triggerEvent) if eventName, eventName can be scroll
// Then => screenshotPhase, takeScreenshot(selector||window)
// And => takeScreenshot(selector)
// Given => closePrevious, begin loadingPhase, openWindow 
