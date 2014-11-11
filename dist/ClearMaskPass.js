(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.ClearMaskPass = factory();
  }
}(this, function() {
var ClearMaskPass;

ClearMaskPass = (function() {
  function ClearMaskPass() {
    this.enabled = true;
  }

  ClearMaskPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta) {
    var context;
    context = renderer.context;
    return context.disable(context.STENCIL_TEST);
  };

  return ClearMaskPass;

})();

return ClearMaskPass;
}));
