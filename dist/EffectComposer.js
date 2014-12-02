(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.EffectComposer = factory();
  }
}(this, function() {
var ClearMaskPass, CopyShader, EffectComposer, MaskPass, THREE, RenderPass, ShaderPass;

THREE = require('threejs');

CopyShader = require('./copyshader');

MaskPass = require('./maskpass');
ClearMaskPass = require('./clearmaskpass');
RenderPass = require('./renderpass');
ShaderPass = require('./shaderpass');

EffectComposer = (function() {
  EffectComposer.prototype.renderer = null;

  EffectComposer.prototype.renderTarget1 = null;

  EffectComposer.prototype.renderTarget2 = null;

  EffectComposer.prototype.writeBuffer = null;

  EffectComposer.prototype.readBuffer = null;

  EffectComposer.prototype.passes = null;

  EffectComposer.prototype.RenderPass = RenderPass;
  EffectComposer.prototype.ShaderPass = ShaderPass;

  function EffectComposer(renderer, renderTarget) {
    var height, parameters, width;
    this.renderer = renderer;
    if (renderTarget === void 0) {
      width = window.innerWidth || 1;
      height = window.innerHeight || 1;
      parameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: false
      };
      renderTarget = new THREE.WebGLRenderTarget(width, height, parameters);
      this.renderTarget1 = renderTarget;
      this.renderTarget2 = renderTarget.clone();
      this.writeBuffer = this.renderTarget1;
      this.readBuffer = this.renderTarget2;
      this.passes = [];
      if (CopyShader === void 0) {
        console.error("THREE.EffectComposer relies on THREE.CopyShader");
      }
      this.copyPass = new ShaderPass(CopyShader);
    }
  }

  EffectComposer.prototype.swapBuffers = function() {
    var tmp;
    tmp = this.readBuffer;
    this.readBuffer = this.writeBuffer;
    return this.writeBuffer = tmp;
  };

  EffectComposer.prototype.addPass = function(pass) {
    return this.passes.push(pass);
  };

  EffectComposer.prototype.insertPass = function(pass, index) {
    return this.passes.splice(index, 0, pass);
  };

  EffectComposer.prototype.render = function(delta) {
    var context, maskActive, pass, _i, _len, _ref;
    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;
    maskActive = false;
    _ref = this.passes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pass = _ref[_i];
      if (!pass.enabled) {
        continue;
      }
      pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive);
      if (pass.needsSwap) {
        if (maskActive) {
          context = this.renderer.context;
          context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);
          this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta);
          context.stencilFunc(context.EQUAL, 1, 0xffffffff);
        }
        this.swapBuffers();
      }
      if (pass instanceof MaskPass) {
        maskActive = true;
      } else if (pass instanceof ClearMaskPass) {
        maskActive = flase;
      }
    }
    return this;
  };

  EffectComposer.prototype.reset = function(renderTarget) {
    if (renderTarget === void 0) {
      renderTarget = this.renderTarget1.clone();
      renderTarget.width = window.innerWidth;
      renderTarget.height = window.innerHeight;
      this.renderTarget1 = renderTarget;
      this.renderTarget2 = renderTarget.clone();
      this.writeBuffer = this.renderTarget1;
      return this.readBuffer = this.renderTarget2;
    }
  };

  EffectComposer.prototype.setSize = function(width, height) {
    var renderTarget;
    renderTarget = this.renderTarget1.clone();
    renderTarget.width = width;
    renderTarget.height = height;
    return this.reset(renderTarget);
  };

  return EffectComposer;

})();

return EffectComposer;
}));
