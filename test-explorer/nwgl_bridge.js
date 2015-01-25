module.exports = function(explorerWindow, guiWin, canvasC, leftImg, rightImg, vertexSource, fragmentSource) {


console.log("FOOOOOOOOOOOOOOOOO");

  var program = null;
  var gl = null;
  var started = false;

  var guiWidth = 512;
  var guiHeight = 512;
  var compareDir = -1;

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

var setupTexture = function(tex, cnv, textureUnit, uniformName) {
  updateTextureFromCanvas(tex, cnv, textureUnit);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  var location = gl.getUniformLocation(program, uniformName);
  gl.uniform1i(location, textureUnit);
};

var updateTextureFromCanvas = function(tex, cnv, textureUnit) {
  gl.activeTexture(gl.TEXTURE0 + textureUnit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  //console.log(gl.TEXTURE_2D.toString(), "0", gl.RGB.toString(), gl.RGBA.toString(), gl.UNSIGNED_BYTE.toString(), cnv.toString(), "!!!");
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cnv);
};

//////////////////////////////////////////////

gl = canvasC.getContext("webgl");

if (!gl) {
  console.error("gl error");
  throw "wtf";
}

var shader0 = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(shader0, vertexSource);
gl.compileShader(shader0);
gl.getShaderParameter(shader0, gl.COMPILE_STATUS);
gl.getShaderInfoLog(shader0);

var shader1 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(shader1, fragmentSource);
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

///////////////////////////////////////////////////////////////////////


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

  var onGuiWinLoaded = function() {
    if (!started) {
      console.log("starting");
      started = true;
      guiWin.window.requestAnimationFrame(everyContextFrame);
    }
  };

  //guiWin.moveBy(512, 0);
  guiWin.on('loaded', onGuiWinLoaded);


  var main = function(canvas1, canvas2) {
    var a = setupTexture(tex1, canvas1, 0, "u_canvas1");
    var b = setupTexture(tex2, canvas2, 1, "u_canvas2");

    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    var c = setupTexture(texC, canvasC, 2, "u_canvasC");

    if (started) {
      guiWin.window.requestAnimationFrame(everyContextFrame);
    }
  };

  var everyExplorerFrame = function() {
    if (compareDir === -1) {
      main(rightImg, leftImg);
    } else {
      main(leftImg, rightImg);
    }
  };

  leftImg.onload = function() {
    compareDir *= -1;
    explorerWindow.requestAnimationFrame(everyExplorerFrame);
  };

  rightImg.onload = function() {
    compareDir *= -1;
    explorerWindow.requestAnimationFrame(everyExplorerFrame);
  };

  explorerWindow.requestAnimationFrame(everyExplorerFrame);

};
