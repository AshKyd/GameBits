The idea is that this object can automatically cache a Canvas animation.
It's designed to be used with the related animation objects in this
repo, however it may be useful in other circumstances.

It operates by creating a buffer canvas, and pre-rendering the animation
frames to save on processor time rendering any effects.


Parameters:
;tick
: The function to call to render to canvas. Function accepts two
  arguments:
  1. ctx - The canvas context to draw on.
  2. delta - the time delta to render at.
;width
: The maximum width of the sprite.
:height
: The maximum height of the sprite.
;deltaStart
: Default 0. The starting delta for this animation.
;deltaRange
: The delta range we want to render between. By default, this is the
  number of frames we want to render.
;deltaIncrement
: The increment, for instance "16" would render 1 frame per second, when
  specifying the delta in milliseconds (I think).
