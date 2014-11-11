class MaskPass

  constructor:( scene, camera )->
    @scene = scene
    @camera = camera
    @enabled = true
    @clear = true
    @needsSwap = false
    @inverse = false

  render:(renderer, writeBuffer, readBuffer, delta) ->
    context = renderer.context
    #don't update color or depth

    context.colorMask( false, false, false, false )
    context.depthMask( false )

    #set up stencil
    writeValue = -1
    clearValue = -1

    if @inverse
      writeValue = 0
      clearValue = 1
    else
      writeValue = 1
      clearValue = 0

    context.enable( context.STENCIL_TEST )
    context.stencilOp( context.REPLACE, context.REPLACE, context.REPLACE )
    context.stencilFunc( context.ALWAYS, writeValue, 0xffffffff )
    context.clearStencil( clearValue )

    # draw into the stencil buffer
    renderer.render(@scene, @camera, readBuffer, @clear)
    renderer.render(@scene, @camera, writeBuffer, @clear)

    # re-enable update of color and depth
    context.colorMask( true, true, true, true )
    context.depthMask( true )

    # only render where stencil is set to 1
    context.stencilFunc( context.EQUAL, 1, 0xffffffff )  # draw if == 1
    context.stencilOp( context.KEEP, context.KEEP, context.KEEP )
