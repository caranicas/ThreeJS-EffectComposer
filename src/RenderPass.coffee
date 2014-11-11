#@author alteredq / http://alteredqualia.com/

THREE = require 'threejs'

class RenderPass

  constructor:(scene, camera, overrideMaterial, clearColor, clearAlpha) ->
    @scene = scene
    @camera = camera
    @overrideMaterial = overrideMaterial
    @clearColor = clearColor
    @clearAlpha = if clearAlpha? then clearAlpha else 1

    @oldClearColor = new THREE.Color()
    @oldClearAlpha = 1

    @enabled = true
    @clear = true
    @needsSwap = false


  render:(renderer, writeBuffer, readBuffer, delta) ->
    @scene.overrideMaterial = @overrideMaterial
    if @clearColor
      @oldClearColor.copy( renderer.getClearColor())
      @oldClearAlpha = renderer.getClearAlpha()
      renderer.setClearColor(@clearColor, @clearAlpha)

    renderer.render(@scene, @camera, readBuffer, @clear)

    if @clearColor
      renderer.setClearColor(@oldClearColor, @oldClearAlpha)

    @scene.overrideMaterial = null
