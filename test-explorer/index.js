
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
  var NWGui = require('nw.gui');
  var Cucumber = require('cucumber');

  // Grab the arguments
  var url = NWGui.App.argv[0];

  // var win = gui.Window.open('http://google.com/', {
  var guiWin = NWGui.Window.open(url, {
    width: guiWidth,
    height: guiHeight,
    focus: false,
    frame: true,
    toolbar: true,
    show: true
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

  var featureSource = "Feature: One Two Three\n  Scenario: ABC\n    Given 123";

  var supportCode = function() {
    this.World = function(callback) {
      console.log("Make World");
      callback();
    };

    var Given = When = Then = this.defineStep;

    Given(/^(\d+)$/, function(number, callback) {
      console.log(number);
      callback();
    });
  };

/*
  var supportCodeHelper = {
    Around           : self.defineAroundHook,
    Before           : self.defineBeforeHook,
    After            : self.defineAfterHook,
    Given            : self.defineStep,
    When             : self.defineStep,
    Then             : self.defineStep,
    defineStep       : self.defineStep,
    registerListener : self.registerListener,
    registerHandler  : self.registerHandler,
    World            : worldConstructor
  };
*/

  var cucumber = Cucumber(featureSource, supportCode);
  cucumber.start(function() {
    console.log("finished cucumber");
  });
}
