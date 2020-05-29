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


## available collision checks

### aabb-aabb-overlap


```javascript
const c = contact()
const collided = aabbAABBOverlap(aabb, aabb2, c)
```


### aabb-aabb-sweep1

```javascript
const c = contact()
const collided = aabbAABBSweep1(aabb, aabb2, delta, c)
```


### aabb-aabb-sweep2

```javascript
const c = contact()
const collided = aabbAABBSweep2(aabb, delta, aabb2, delta2, c)
```


### aabb-point-overlap

```javascript
const c = contact()
const collided = aabbPointOverlap(aabb, point, c)
```


### aabb-segment-overlap

```javascript
const c = contact()
const collided = aabbSegmentOverlap(aabb, pos, delta, paddingX, paddingY, c)
```


### ray-plane-overlap

```javascript
const distanceFromRayOriginToPlane = rayPlaneOverlap(rayOrigin, rayVector, planeOrigin, planeNormal)
```


### segment-normal

```javascript
const normal = vec2.create()
segmentNormal(normal, pos1, pos2)
```


### segment-point-overlap

```javascript
const pointOverlapsSegment = segmentPointOverlap(p, segPoint0, setPoint1) // true or false
```


### segment-segment-overlap

```javascript
const segmentsOverlap = segmentSegmentOverlap(pos1, pos2, pos3, pos4, intersection) 
```


### segments-segment-overlap

```javascript
const c = contact()
const segmentsOverlap = segmentsSegmentOverlap(segments, start, delta, c)
```


### segments-sphere-sweep1

```javascript
const c = contact()
const collided = segmentsSphereSweep1(segments, position, radius, delta, c)
```


## conventions

All collision checking functions return a boolean indicating if there was a collision. They also accept an optional `contact` argument, which gets filled in if there is an actual collision.

Here is the structure of a `contact` object:

```javascript
{
    collider : null,     // reference to the object that was collided with
    position : [ 0, 0 ], // the exact position of the collision
    delta    : [ 0, 0 ], // a vector that can be applied to get out of the colliding state
    normal   : [ 0, 0 ], // the collision normal vector
    time     : 0         // the time of the collision, from 0..1
}
```

"sweep" tests indicate at least 1 of the objects is moving. the number indicates how many objects are moving. e.g., `aabb-aabb-sweep2` means we are comparing 2 aabbs, both of which are moving.

"overlap" tests don't take movement into account, and this is a static check to see if the 2 entities overlap.

plural forms imply a collection. e.g., `segments-segment-ovelap` checks one line segment against a set of line segments. If there is more than one collision, the closest collision is set in the `contact` argument.


## credits

Most of these collision checks were adapted from existing open source modules:

* https://github.com/noonat/intersect
* https://github.com/kevzettler/gl-swept-sphere-triangle
