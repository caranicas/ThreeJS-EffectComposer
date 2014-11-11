THREE = require 'threejs'

class ShaderPass

  constructor:(shader, textureID)->
    @textureID = if textureID? then textureID else  "tDiffuse"
    @uniforms = THREE.UniformsUtils.clone( shader.uniforms )
    @material = new THREE.ShaderMaterial( {uniforms: @uniforms,vertexShader: shader.vertexShader,fragmentShader: shader.fragmentShader})

    @renderToScreen = false

    @enabled = true
    @needsSwap = true
    @clear = false
    @camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 )
    @scene  = new THREE.Scene()

    @quad = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null )
    @scene.add( @quad )


  render:(renderer, writeBuffer, readBuffer, delta) ->

    if @uniforms[@textureID]
      @uniforms[ @textureID ].value = readBuffer

    @quad.material = @material

    if @renderToScreen
      renderer.render( @scene, @camera )
    else
      renderer.render( @scene, @camera, writeBuffer, @clear )
