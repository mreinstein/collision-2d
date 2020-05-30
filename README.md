# collision-2d

There are many javascript collision routines and libraries for 2d. None satisifed all of these criteria:

* consistent API interface
* doesn't generate garbage
* consistent vector/matrix/line representation
* is data-oriented
* is purely functional
* collisions only - no gravity, rigid body handling, or complex solvers
* pure es modules

so here we are!

## entities

The collision routines all use these entity definitions


### point

a point is a 2d vector, which is represented as an array with 2 values:
```javascript

const position = [ 200, 150 ] // x: 200, y: 150

```

We use the fantastic `gl-matrix` `vec2` for representing these.


### aabb

an axially aligned bounding box
```javascript
const aabb = {
    position: [ 200, 100 ],  // top left corner of the AABB
    width: 50,
    height: 50
}
```

###  segment

a line segment consists of 2 `point`s
```javascript
const segment = [
    [ 0, 0 ],   // starting point of line
    [ 100, 0 ]  // ending point of line
]
```


### contact

The data structure populated when a collision occurs

```javascript
{
    collider : null,     // reference to the object that was collided with
    position : [ 0, 0 ], // the exact position of the collision
    delta    : [ 0, 0 ], // a vector that can be applied to get out of the colliding state
    normal   : [ 0, 0 ], // the collision normal vector
    time     : 0         // the time of the collision, from 0..1
}
```


## available collision checks

```javascript
const collided = aabbAABBOverlap(aabb, aabb2, contact)
```


```javascript
const c = contact()
const collided = aabbAABBSweep1(aabb, aabb2, delta, contact)
```


```javascript
const collided = aabbAABBSweep2(aabb, delta, aabb2, delta2, contact)
```


```javascript
const collided = aabbPointOverlap(aabb, point, contact)
```


```javascript
const collided = aabbSegmentOverlap(aabb, pos, delta, paddingX, paddingY, contact)
```


```javascript
const distanceFromRayOriginToPlane = rayPlaneOverlap(rayOrigin, rayVector, planeOrigin, planeNormal)
```


```javascript
const normal = vec2.create()
segmentNormal(normal, pos1, pos2)
```


```javascript
const pointOverlapsSegment = segmentPointOverlap(p, segPoint0, segPoint1) // true or false
```


```javascript
const intersectionPoint = vec2.create()
if (segmentSegmentOverlap(segment1Point1, segment1Point2, segment2Point1, segment2Point2, intersectionPoint)) {
    // if we get here, intersectionPoint is filled in with where the 2 segments overlap
}
```


```javascript
const segmentsOverlap = segmentsSegmentOverlap(segments, start, delta, contact)
```


```javascript
const collided = segmentsSphereSweep1(segments, position, radius, delta, contact)
```


## conventions

All collision checking functions return a boolean indicating if there was a collision. They also accept an optional `contact` argument, which gets filled in if there is an actual collision.


"sweep" tests indicate at least 1 of the objects is moving. the number indicates how many objects are moving. e.g., `aabb-aabb-sweep2` means we are comparing 2 aabbs, both of which are moving.

"overlap" tests don't take movement into account, and this is a static check to see if the 2 entities overlap.

plural forms imply a collection. e.g., `segments-segment-ovelap` checks one line segment against a set of line segments. If there is more than one collision, the closest collision is set in the `contact` argument.


## credits

Most of these collision checks were adapted from existing open source modules:

* https://github.com/noonat/intersect
* https://github.com/kevzettler/gl-swept-sphere-triangle
* https://gist.github.com/toji/2802287
* http://www.gamasutra.com/view/feature/131790/simple_intersection_tests_for_games.php
