
var guiWidth = 512;
var guiHeight = 512;
var program = null;
var gl = null;
var leftImg = null;
var rightImg = null;
var compareDir = -1;
var started = false;
var canvasC = false;

leftImg = document.getElementById("img-0");
rightImg = document.getElementById("img-1");
canvasC = document.getElementById("webgl-container");

var setRectangle = function(gll, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gll.bufferData(gll.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2]), gll.STATIC_DRAW);
};

var setupTexture = function(tex, cnv, textureUnit, pgm, uniformName) {
  updateTextureFromCanvas(tex, cnv, textureUnit);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  var location = gl.getUniformLocation(pgm, uniformName);
  gl.uniform1i(location, textureUnit);
};

var updateTextureFromCanvas = function(tex, cnv, textureUnit) {
  gl.activeTexture(gl.TEXTURE0 + textureUnit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cnv);
};

var main = function(pgm, canvas1, canvas2) {
  var a = setupTexture(tex1, canvas1, 0, pgm, "u_canvas1");
  var b = setupTexture(tex2, canvas2, 1, pgm, "u_canvas2");

  // Draw the rectangle.
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  var c = setupTexture(texC, canvasC, 2, pgm, "u_canvasC");

  if (started) {
    guiWin.window.requestAnimationFrame(everyContextFrame);
  }
};

var everyExplorerFrame = function() {
  if (compareDir === -1) {
    main(program, rightImg, leftImg);
  } else {
    main(program, leftImg, rightImg);
  }
};

gl = canvasC.getContext("webgl");

if (!gl) {
  console.error("gl error");
  throw "wtf";
}

var shader0 = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(shader0, document.getElementById("vertex-0").innerHTML);
gl.compileShader(shader0);
gl.getShaderParameter(shader0, gl.COMPILE_STATUS);
gl.getShaderInfoLog(shader0);

var shader1 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(shader1, document.getElementById("fragment-0").innerHTML);
gl.compileShader(shader1);
gl.getShaderParameter(shader1, gl.COMPILE_STATUS);

var program0 = gl.createProgram();
gl.attachShader(program0, shader0);
gl.attachShader(program0, shader1);
gl.linkProgram(program0);
gl.getProgramParameter(program0, gl.LINK_STATUS);

program = program0;

gl.useProgram(program);

// look up where the vertex data needs to go.
var positionLocation = gl.getAttribLocation(program, "a_position");
var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

// provide texture coordinates for the rectangle.
var texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    0.0,  1.0,
    0.0,  1.0,
    1.0,  0.0,
    1.0,  1.0]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(texCoordLocation);
gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

// lookup uniforms
var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

// set the resolution
gl.uniform2f(resolutionLocation, guiWidth, guiHeight);

// Create a buffer for the position of the rectangle corners.
var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Set a rectangle the same size as the image.
setRectangle(gl, 0, 0, guiWidth, guiHeight);

var tex1 = gl.createTexture();
var tex2 = gl.createTexture();
var texC = gl.createTexture();

if (typeof(require) === 'function') {

  // TODO: When an error occurs, log it and exit
  process.on('uncaughtException', function handleErr (err) {
    throw err;
  });

  // Load in dependencies
  var fs = require('fs');
  var NWGui = require('nw.gui');
  var Cucumber = require('cucumber');
  var ansispan = require('./ansispan');

  // Grab the arguments
  var projectDirectory = NWGui.App.argv[0];
  var url = "http://google.com/";

  // var win = gui.Window.open('http://google.com/', {
  var guiWin = NWGui.Window.open(url, {
    width: guiWidth,
    height: guiHeight,
    focus: false,
    frame: true,
    toolbar: true,
    show: false
  });

  var everyContextFrame = function() {
    guiWin.capturePage(function handleScreenshot (buff) {
      var copy = buff.toString();

      if (compareDir === -1) {
        if (leftImg.src === copy) {
          setTimeout(function() {
            leftImg.onload();
          }, 67);
        } else {
          leftImg.src = copy;
        }
      } else {
        if (rightImg.src === copy) {
          setTimeout(function() {
            rightImg.onload();
          }, 67);
        } else {
          rightImg.src = copy;
        }
      }
    }, {format: 'png', datatype: 'datauri'}); // valid datatypes : "[raw|buffer|datauri]" 
  };

  window.focus();

  window.addEventListener('load', function() {
    leftImg.onload = function() {
      compareDir *= -1;
      window.requestAnimationFrame(everyExplorerFrame);
    };

    rightImg.onload = function() {
      compareDir *= -1;
      window.requestAnimationFrame(everyExplorerFrame);
    };

    window.requestAnimationFrame(everyExplorerFrame);
  });

  guiWin.on('loaded', function() {
    guiWin.moveBy(512, 0);
    if (!started) {
      console.log("starting");
      started = true;
      guiWin.window.requestAnimationFrame(everyContextFrame);
    }
  });


  var shedFileOpened = function(err, fd) {
    if (err) throw err;

    var featureSource = fd.toString();

    var worldCount = 0;

    var supportCode = function() {
      this.World = function(callback) {
        console.log(this.bar, "Make World: " + worldCount);
        callback({foo: 'bar' + worldCount++});
      };

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
        callback("broke");
      });

      this.When(needToOpenUrl, function(url, callback) {
        console.log(this.foo, "when: " + url);
        callback("Error");
      });

      this.Then(cssSelectorShouldBePresent, function(cssSelector, callback) {
        console.log(this.foo, "css: " + cssSelector);
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
    var util = require('./util')
    var dirname = util.dirname;

    console.log('nw directory: ' + process.cwd(), dirname, projectDirectory + "/Shedfile");

    fs.readFile(projectDirectory + "/Shedfile", shedFileOpened);
  };

  boot();
}
