# collision-2d

a carefully curated collection of 2d javascript collision routines


## why another collision package?

over the years I've found dozens of collision routines and libraries for 2d.
None that satisifed all of these criteria:

* consistent API interface - most of the collision routines are one-off and each is a special snowflake. No uniform interface means ugly integration, and converting between different representations
* avoids generating memory garbage - most of the toy collision routines out in the wild don't specifically avoid creating memory garbage, which thrashes the javascript garbage collector
* consistent vector/matrix representation - gl-matrix is the industry standard. use that!
* is data-oriented and purely functional - does not spew state all over your application by wrapping up methods and data. All functions are pure and accept common data structures
* avoids bloat - many of the collision routines available are part of a larger physics engine, and that brings a lot of bloat. Things like gravity, rigid body handling, and complex solvers are a separate problem that don't belong in collision handling routines. keep the concerns separate!
* uses pure es modules - we have a way out of proprietary module and bundling systems now.

so here we are!


## available collision checks

* aabb-aabb-overlap
* aabb-aabb-sweep1
* aabb-aabb-sweep2
* aabb-segment-overlap
* ray-plane-overlap
* segment-normal
* segment-point-overlap
* segment-segment-overlap
* segments-segment-overlap
* segments-sphere-sweep1
* sphere-sphere-sweep2


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


