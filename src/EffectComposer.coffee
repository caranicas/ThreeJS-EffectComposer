#All files originally authroed by @alteredq - http://alteredqualia.com/

THREE = require 'threejs'
CopyShader = require './copyshader'
MaskPass = require './maskpass'
ClearMaskPass = require './clearmaskpass'
RenderPass = rquire './renderpass'
ShaderPass = require './shaderpass'

class EffectComposer

  renderer:null
  renderTarget1:null
  renderTarget2:null
  writeBuffer:null
  readBuffer:null
  passes:null
  RenderPass:RenderPass
  ShaderPass:ShaderPass

  constructor:(renderer, renderTarget) ->
    @renderer = renderer

    if renderTarget is undefined
      width = window.innerWidth || 1
      height = window.innerHeight || 1
      parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false }
      renderTarget = new THREE.WebGLRenderTarget( width, height, parameters )

      @renderTarget1 = renderTarget
      @renderTarget2 = renderTarget.clone()

      @writeBuffer = @renderTarget1
      @readBuffer = @renderTarget2

      @passes = []

      if CopyShader is undefined
        console.error( "THREE.EffectComposer relies on THREE.CopyShader" )

      @copyPass = new ShaderPass( CopyShader )

  swapBuffers: ->
    tmp = this.readBuffer
    @readBuffer = @writeBuffer
    @writeBuffer = tmp

  addPass:( pass )->
    @passes.push( pass )

  insertPass:( pass, index ) ->
    @passes.splice( index, 0, pass )

  render:( delta )->
    @writeBuffer = @renderTarget1
    @readBuffer = this.renderTarget2

    maskActive = false

    for pass in @passes
      if not pass.enabled
        continue

      pass.render(@renderer,@writeBuffer,@readBuffer,delta,maskActive)

      if pass.needsSwap
        if maskActive
          context = @renderer.context
          context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff )
          @copyPass.render(@.renderer,@.writeBuffer,@.readBuffer, delta )
          context.stencilFunc( context.EQUAL, 1, 0xffffffff )

        @swapBuffers()

      if pass instanceof MaskPass
        maskActive = true
      else if pass instanceof ClearMaskPass
        maskActive = flase
    @


  reset:( renderTarget )  ->
    if renderTarget is undefined
      renderTarget = @renderTarget1.clone()
      renderTarget.width = window.innerWidth
      renderTarget.height = window.innerHeight

      @renderTarget1 = renderTarget
      @renderTarget2 = renderTarget.clone()

      @writeBuffer = this.renderTarget1
      @readBuffer = this.renderTarget2

  setSize:( width, height ) ->
    renderTarget = @renderTarget1.clone()
    renderTarget.width = width
    renderTarget.height = height

    @reset( renderTarget )
