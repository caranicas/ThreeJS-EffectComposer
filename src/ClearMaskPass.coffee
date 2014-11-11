class ClearMaskPass

  constructor:() ->
    @enabled = true

  render:( renderer, writeBuffer, readBuffer, delta ) ->
    context = renderer.context
    context.disable( context.STENCIL_TEST )
