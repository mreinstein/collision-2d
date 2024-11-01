# collision-2d

There are many javascript collision routines and libraries for 2d. None satisifed all of these criteria:

* consistent vector/matrix/line representation
* doesn't generate memory garbage
* is data-oriented and functional
* consistent API interface
* collisions only - no gravity, rigid body handling, or complex solvers
* pure es modules

so here we are!


Note: If you're looking for higher-level 2d collision handling routine for ellipsoids vs line segments, check out https://github.com/mreinstein/collide-and-slide-2d


## available collision checks


### aabb-aabb overlap

![alt text](docs/aabb-aabb-overlap.png "AABB-AABB overlap test")

```javascript
import { aabbOverlap } from '@footgun/collision-2d'

const collided = aabbOverlap(aabb, aabb2, contact)
```

### aabb-aabb contain

```javascript
import { aabbContain } from '@footgun/collision-2d'

// true when aabb1 fully contains aabb2 (2 is fully inside the bounds of 1)
const contains = aabbContain(aabb1, aabb2)
```


### aabb-aabb sweep 1

![alt text](docs/aabb-aabb-sweep1.png "AABB-AABB sweep 1 test")

```javascript
import { aabbSweep1 } from '@footgun/collision-2d'

const collided = aabbSweep1(aabb, aabb2, delta, contact)
```


### aabb-aabb sweep 2

![alt text](docs/aabb-aabb-sweep2.png "AABB-AABB sweep 2 test")

```javascript
import { aabbSweep2 } from '@footgun/collision-2d'

const collided = aabbSweep2(aabb, delta, aabb2, delta2, contact)
```


### aabb-segment sweep

![alt text](docs/aabb-segment-sweep1.png "AABB-segment sweep test")

```javascript
import { aabbSegSweep1 } from '@footgun/collision-2d'

const collided = aabbSegSweep1(line, aabb, delta, contact)
```


### aabb-segments sweep-indexed

![alt text](docs/aabb-segments-sweep1-indexed.png "AABB-segments indexed sweep test")

```javascript
import { aabbSegsSweep1Indexed } from '@footgun/collision-2d'

const collided = aabbSegsSweep1Indexed(segments, indices, segmentCount, aabb, delta, contact)
```

if there is a collision, `contact.collider` will be an integer indicating the index of which segment in the `segments` array collided.


### aabb-point overlap

![alt text](docs/aabb-point-overlap.png "AABB-point overlap test")

```javascript
import { aabbPointOverlap } from '@footgun/collision-2d'

const collided = aabbPointOverlap(aabb, point, contact)
```


### aabb-segment overlap

![alt text](docs/aabb-segment-overlap.png "AABB-segment overlap test")

```javascript
import { aabbSegOverlap } from '@footgun/collision-2d'

const collided = aabbSegOverlap(aabb, pos, delta, paddingX, paddingY, contact)
```



### ray-plane-distance

![alt text](docs/ray-plane-distance.png "ray-plane distance")

```javascript
import { Plane } from '@footgun/collision-2d'

const p = Plane.create()
Plane.fromPlane(p, planeOrigin, planeNormal)
const distance = Plane.rayDistance(p, rayOrigin, rayVector)

```


### ray-sphere overlap

![alt text](docs/ray-sphere-overlap.png "ray-sphere overlap test")

```javascript
import { raySphereOverlap } from '@footgun/collision-2d'


// declare 2 points that lie on an infinite ray
const p1 = [ 100, 100 ]
const p2 = [ 200, 100 ]

const sphereCenter: [ 250, 100 ]
const sphereRadius: 50
const contact = { mu1: NaN, mu2: NaN }
const overlaps = raySphereOverlap(p1, p2, sphereCenter, sphereRadius, contact)

// mu1 and mu2 are the points along the line segment from p1 to p2 where the sphere intersection occurs:
//   intersection1 = p1 + contact.mu1  * (p2 - p1)
//   intersection2 = p1 + contact.mu2  * (p2 - p1)
if (overlaps) {
    console.log('sphere intersection time 1:', contact.mu1)
    console.log('sphere intersection time 2', contact.mu2)
}
```


### segment-sphere overlap

![alt text](docs/segment-sphere-overlap.png "segment-sphere overlap test")

```javascript
import { segSphereOverlap } from '@footgun/collision-2d'


// declare 2 points that lie on a line segment
const p1 = [ 100, 100 ]
const p2 = [ 200, 100 ]

const sphereCenter: [ 250, 100 ]
const sphereRadius: 50
const contact = { intersectionCount: 0, mu1: NaN, mu2: NaN }
const overlaps = segSphereOverlap(p1, p2, sphereCenter, sphereRadius, contact)

// mu1 and mu2 are the points along the line segment from p1 to p2 where the sphere intersection occurs:
//   intersection1 = p1 + contact.mu1  * (p2 - p1)
//   intersection2 = p1 + contact.mu2  * (p2 - p1)
if (overlaps) {
    // the segment interesects the sphere, intersectionCount is 1 or 2
    // either mu1 or mu2 will be NaN if there's not 2 intersections
    console.log('intersection count:', contact.intersectionCount)
    console.log('sphere intersection time 1:', contact.mu1)
    console.log('sphere intersection time 2', contact.mu2)
} else {
    // no overlap, contact.intersectionCount is 0
}
```


### segment-normal

```javascript
import { segNormal } from '@footgun/collision-2d'

const normal = segNormal(vec2.create(), pos1, pos2)
```


### segment-point-overlap

![alt text](docs/segment-point-overlap.png "segment-point overlap test")

```javascript
import { segPointOverlap } from '@footgun/collision-2d'

const collided = segPointOverlap(p, segPoint0, segPoint1) // true or false
```


### segment-segment-overlap

![alt text](docs/segment-segment-overlap.png "segment-segment overlap test")

```javascript
import { segOverlap } from '@footgun/collision-2d'

const intersectionPoint = vec2.create()
if (segOverlap(seg1Point1, seg1Point2, seg2Point1, seg2Point2, intersectionPoint)) {
    // if we get here, intersectionPoint is filled in with where the 2 segments overlap
}
```


### segments-segment-overlap

![alt text](docs/segments-segment-overlap.png "segments-segment overlap test")

```javascript
import { segsSegOverlap } from '@footgun/collision-2d'

const collided = segsSegOverlap(segments, start, delta, contact)
```

if there is a collision, `contact.collider` will be an integer indicating the index of which segment in the `segments` array collided.


### segments-segment-overlap-indexed

```javascript
import { segsSegOverlapIndexed } from '@footgun/collision-2d'

const segs = [
    [ p0, p1 ],
    [ p2, p3 ],
    [ p4, p5 ]
]
const indices = [ 0, 2 ]  // indices into the segs array

const segmentCount = 2    // numer of indices to include. only run the segmentsSegment intersection tests on [ p0, p1 ] and [ p4, p5]

const collided = segsSegOverlapIndexed(segments, indices, segmentCount, start, delta, contact)
```

if there is a collision, `contact.collider` will be an integer indicating the index of which segment in the `segments` array collided.



### segments-sphere-sweep 1

![alt text](docs/segments-sphere-sweep1.png "segments-sphere sweep test")


```javascript
import { segsSphereSweep1 } from '@footgun/collision-2d'

const collided = segsSphereSweep1(segments, position, radius, delta, contact)
```

if there is a collision, `contact.collider` will be an integer indicating the index of which segment in the `segments` array collided.


### segments-sphere-sweep-1-indexed

```javascript
import { segsSphereSweep1Indexed } from '@footgun/collision-2d'

const segs = [
    [ p0, p1 ],
    [ p2, p3 ],
    [ p4, p5 ]
]
const indices = [ 0, 2 ]  // indices into the segs array

const segmentCount = 2    // only run the segmentsSphereSweep tests on [ p0, p1 ] and [ p4, p5 ]

const collided = segsSphereSweep1Indexed(segments, indices, segmentCount, position, radius, delta, contact)
```

if there is a collision, `contact.collider` will be an integer indicating the index of which segment in the `segments` array collided.


### sphere-sphere-overlap

![alt text](docs/sphere-sphere-overlap.png "sphere-sphere overlap test")

```javascript
import { sphereOverlap } from '@footgun/collision-2d'

const collided = sphereOverlap(centerA, radiusA, centerB, radiusB, contact) // collided is true or false
```

if there is a collision, `contact.delta` is a vector that can be added to sphere A’s position to move them into a non-colliding state.
`contact.position` is the point of contact of these 2 spheres

Note: `contact` is an optional parameter. if you only want to determine if the 2 spheres overlap, omit `contact` which will be faster.


### sphere-sphere-sweep2

```javascript
import { sphereSweep2 } from '@footgun/collision-2d'

const collided = sphereSweep2(radiusA, A0, A1, radiusB, B0, B1, contact)
```

* `A0` is the previous position of sphere A
* `A1` is the new position of sphere A
* `B0` is the previous position of sphere B
* `B1` is the new position of sphere B

If there is a collision `contact.position` will contain the point where the collision occurred. `contact.time` has the normalized time
where the collision happened.


### cone-point-overlap

![alt text](docs/cone-point-overlap.png "cone-point overlap test")

```javascript
import { conePointOverlap } from '@footgun/collision-2d'

const collided = conePointOverlap(conePosition, coneRotation, coneFieldOfView, coneMinDistance, coneMaxDistance, point) // collided is true or false
```


### triangle-point-overlap

![alt text](docs/triangle-point-overlap.png "triangle-point overlap test")

```javascript
import { trianglePointOverlap } from '@footgun/collision-2d'

const collided = trianglePointOverlap(v0, v1, v2, point) // collided is true or false
```


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
    position: [ 200, 100 ],  // center point of the AABB
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


### plane

a 2d plane

```javascript
{
    origin: vec2.create(),
    normal: vec2.create(),
    D: 0,
}
```


### contact

The data structure populated when a collision occurs

```javascript
{
    // for segments-segment-overlap and segments-sphere-sweep1 this is set to the index
    // in the array of line segments passed into the collision routine
    // for all other routines, collider is a reference to the colliding object itself
    collider : null,

    position : [ 0, 0 ], // the exact position of the collision
    delta    : [ 0, 0 ], // a vector that can be applied to get out of the colliding state
    normal   : [ 0, 0 ], // the collision normal vector
    time     : 0         // the time of the collision, from 0..1
}
```


## conventions

All collision checking functions return a boolean indicating if there was a collision. They also accept an optional `contact` argument, which gets filled in if there is an actual collision.


"sweep" tests indicate at least 1 of the objects is moving. the number indicates how many objects are moving. e.g., `aabb-aabb-sweep2` means we are comparing 2 aabbs, both of which are moving.

"overlap" tests don't take movement into account, and this is a static check to see if the 2 entities overlap.

plural forms imply a collection. e.g., `segments-segment-ovelap` checks one line segment against a set of line segments. If there is more than one collision, the closest collision is set in the `contact` argument.

"indexed" tests are the same as their non-indexed forms, except they take in an array of segment indices to use. These are nice in that you can avoid having to build large arrays of line segments every frame, if you have things like dynamic line segments (platforms) or have a spatial culling algorithm that selects line segments to include.


## credits

Most of these collision checks were adapted from existing open source modules:

* https://github.com/noonat/intersect
* The diagrams are modified from noonat: https://noonat.github.io/intersect/
* https://github.com/kevzettler/gl-swept-sphere-triangle
* https://gist.github.com/toji/2802287
* segment-point-overlap from https://gist.github.com/mattdesl/47412d930dcd8cd765c871a65532ffac
* segment-segment overlap from https://github.com/tmpvar/segseg
* http://www.gamasutra.com/view/feature/131790/simple_intersection_tests_for_games.php
* http://geomalgorithms.com/a07-_distance.html#dist3D_Segment_to_Segment
* https://observablehq.com/@kelleyvanevert/2d-point-in-triangle-test
* aabb-segment sweep from https://gamedev.stackexchange.com/questions/29479/swept-aabb-vs-line-segment-2d
