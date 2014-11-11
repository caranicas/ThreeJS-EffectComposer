(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.MaskPass = factory();
  }
}(this, function() {
var MaskPass;

MaskPass = (function() {
  function MaskPass(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.enabled = true;
    this.clear = true;
    this.needsSwap = false;
    this.inverse = false;
  }

  MaskPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta) {
    var clearValue, context, writeValue;
    context = renderer.context;
    context.colorMask(false, false, false, false);
    context.depthMask(false);
    writeValue = -1;
    clearValue = -1;
    if (this.inverse) {
      writeValue = 0;
      clearValue = 1;
    } else {
      writeValue = 1;
      clearValue = 0;
    }
    context.enable(context.STENCIL_TEST);
    context.stencilOp(context.REPLACE, context.REPLACE, context.REPLACE);
    context.stencilFunc(context.ALWAYS, writeValue, 0xffffffff);
    context.clearStencil(clearValue);
    renderer.render(this.scene, this.camera, readBuffer, this.clear);
    renderer.render(this.scene, this.camera, writeBuffer, this.clear);
    context.colorMask(true, true, true, true);
    context.depthMask(true);
    context.stencilFunc(context.EQUAL, 1, 0xffffffff);
    return context.stencilOp(context.KEEP, context.KEEP, context.KEEP);
  };

  return MaskPass;

})();

return MaskPass;
}));
