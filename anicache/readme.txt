The idea is that this object can automatically cache a Canvas animation.
It's designed to be used with the related animation objects in this
repo, however it may be useful in other circumstances.

It operates by creating a buffer canvas, and pre-rendering the animation
frames to save on processor time rendering any effects.


Parameters
=================================
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

Usage
=================================
Multiple instances of Anicache can run simultaneously, but each instance
can only draw one animation at a time. Calling the start() function on 
an instance resets it to its original state and starts the animation
from the beginning.

For this reason if you require multiple simultaneous instances of the
same animation, you will need to implement either an object clone, or
pre-render multiple animations for use in your project.

The object is to be used as follows:

1. Create a new Anicache instance with the required parameters.
2. The Anicache instance will automatically render out the requested sprite.
3. Call the start() function, specifying a context, x, and y position.
4. Call the tick() function on the instance the animation in your game loop.

See the demo for a more complex demonstration.
