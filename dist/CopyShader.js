(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.CopyShader = factory();
  }
}(this, function() {
var CopyShader;

CopyShader = (function() {
  function CopyShader() {}

  CopyShader.prototype.uniforms = {
    "tDiffuse": {
      type: "t",
      value: null
    },
    "opacity": {
      type: "f",
      value: 1.0
    }
  };

  CopyShader.prototype.vertexShader = ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n");

  CopyShader.prototype.fragmentShader = ["uniform float opacity;", "uniform sampler2D tDiffuse;", "varying vec2 vUv;", "void main() {", "vec4 texel = texture2D( tDiffuse, vUv );", "gl_FragColor = opacity * texel;", "}"].join("\n");

  return CopyShader;

})();

return CopyShader;
}));
