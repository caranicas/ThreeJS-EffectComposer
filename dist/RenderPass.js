(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.RenderPass = factory();
  }
}(this, function() {
var RenderPass, THREE;

THREE = require('threejs');

RenderPass = (function() {
  function RenderPass(scene, camera, overrideMaterial, clearColor, clearAlpha) {
    this.scene = scene;
    this.camera = camera;
    this.overrideMaterial = overrideMaterial;
    this.clearColor = clearColor;
    this.clearAlpha = clearAlpha != null ? clearAlpha : 1;
    this.oldClearColor = new THREE.Color();
    this.oldClearAlpha = 1;
    this.enabled = true;
    this.clear = true;
    this.needsSwap = false;
  }

  RenderPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta) {
    this.scene.overrideMaterial = this.overrideMaterial;
    if (this.clearColor) {
      this.oldClearColor.copy(renderer.getClearColor());
      this.oldClearAlpha = renderer.getClearAlpha();
      renderer.setClearColor(this.clearColor, this.clearAlpha);
    }
    renderer.render(this.scene, this.camera, readBuffer, this.clear);
    if (this.clearColor) {
      renderer.setClearColor(this.oldClearColor, this.oldClearAlpha);
    }
    return this.scene.overrideMaterial = null;
  };

  return RenderPass;

})();

return RenderPass;
}));
