// from https://github.com/kevzettler/gl-swept-sphere-triangle
import { vec2 }       from './deps.js'
import TraceInfo      from './TraceInfo.js'
import lineNormal     from './segment-normal.js'
import pointInSegment from './segment-point-overlap.js'


var ta = vec2.create()
var tb = vec2.create()

var norm = vec2.create()

var v = vec2.create()
var edge = vec2.create()

var planeIntersect = vec2.create()

var pt0 = vec2.create()
var pt1 = vec2.create()


// TODO: Don't like the duality of returning a null or float, probably doesn't optimize nicely
function getLowestRoot (a, b, c, maxR) {
  var det = b * b - 4.0 * a * c

  if (det < 0)
    return null

  var sqrtDet = Math.sqrt(det)
  var r1 = (-b - sqrtDet) / (2.0*a)
  var r2 = (-b + sqrtDet) / (2.0*a)

  if (r1 > r2) {
    var tmp = r2
    r2 = r1
    r1 = tmp
  }

  if (r1 > 0 && r1 < maxR)
    return r1

  if (r2 > 0 && r2 < maxR)
    return r2

  return null
}


function testVertex (p, velSqrLen, t, start, vel, trace) {
    vec2.subtract(v, start, p)
    var b = 2.0 * vec2.dot(vel, v)
    var c = vec2.squaredLength(v) - 1.0
    var newT = getLowestRoot(velSqrLen, b, c, t)
    if (newT !== null) {
        trace.setCollision(newT, p)
        return newT
    }
    return t
}


function testEdge (pa, pb, velSqrLen, t, start, vel, trace) {
  vec2.subtract(edge, pb, pa)
  vec2.subtract(v, pa, start)

  var edgeSqrLen = vec2.squaredLength(edge)
  var edgeDotVel = vec2.dot(edge, vel)
  var edgeDotSphereVert = vec2.dot(edge, v)

  var a = edgeSqrLen*-velSqrLen + edgeDotVel*edgeDotVel
  var b = edgeSqrLen*(2.0*vec2.dot(vel, v))-2.0*edgeDotVel*edgeDotSphereVert
  var c = edgeSqrLen*(1.0-vec2.squaredLength(v))+edgeDotSphereVert*edgeDotSphereVert

  // Check for intersection against infinite line
  var newT = getLowestRoot(a, b, c, t)
  if (newT !== null && newT < trace.t) {
    // Check if intersection against the line segment:
    var f = (edgeDotVel*newT-edgeDotSphereVert)/edgeSqrLen
    if (f >= 0.0 && f <= 1.0) {
      vec2.scale(v, edge, f)
      vec2.add(v, pa, v)
      trace.setCollision(newT, v)
      return newT
    }
  }
  return t
}


/**
 * @param {vec2} a First line vertex
 * @param {vec2} b Second line vertex
 * @param {TraceInfo} trace TraceInfo containing the sphere path to trace
 */
function traceSphereTriangle (a, b, trace) {
  trace.tmpTri = [ a, b ]
  var invRadius = trace.invRadius
  var vel = trace.scaledVel
  var start = trace.scaledStart

  // Scale the triangle points so that we're colliding against a unit-radius sphere.
  vec2.scale(ta, a, invRadius)
  vec2.scale(tb, b, invRadius)

  lineNormal(norm, ta, tb)

  trace.tmpTriNorm = norm
  var planeD = -(norm[0]*ta[0]+norm[1] *ta[1])

  // Colliding against the backface of the triangle
  if (vec2.dot(norm, trace.normVel) >= 0) {
    // Two choices at this point:

    // 1) Negate the normal so that it always points towards the start point
    // This feels kludgy, but I'm not sure if there's a better alternative
    /*vec2.negate(norm, norm)
       planeD = -planeD*/

    // 2) Or allow it to pass through
    return
  }

  // Get interval of plane intersection:
  var t0, t1
  var embedded = false

  // Calculate the signed distance from sphere
  // position to triangle plane
  var distToPlane = vec2.dot(start, norm) + planeD

  // cache this as we’re going to use it a few times below:
  var normDotVel = vec2.dot(norm, vel)

  if (normDotVel === 0.0) {
    // Sphere is travelling parrallel to the plane:
    if (Math.abs(distToPlane) >= 1.0) {
      // Sphere is not embedded in plane, No collision possible
      return
    } else {
      // Sphere is completely embedded in plane.
      // It intersects in the whole range [0..1]
      embedded = true
      t0 = 0.0
      t1 = 1.0
    }
  } else {
    // Calculate intersection interval:
    t0 = (-1.0-distToPlane) / normDotVel
    t1 = ( 1.0-distToPlane) / normDotVel
    // Swap so t0 < t1
    if (t0 > t1) {
      var temp = t1
      t1 = t0
      t0 = temp
    }
    // Check that at least one result is within range:
    if (t0 > 1.0 || t1 < 0.0) {
      // No collision possible
      return
    }
    // Clamp to [0,1]
    if (t0 < 0.0) t0 = 0.0
    if (t1 < 0.0) t1 = 0.0
    if (t0 > 1.0) t0 = 1.0
    if (t1 > 1.0) t1 = 1.0
  }

  // If the closest possible collision point is further away
  // than an already detected collision then there's no point
  // in testing further.
  if (t0 >= trace.t)
      return

  // t0 and t1 now represent the range of the sphere movement
  // during which it intersects with the triangle plane.
  // Collisions cannot happen outside that range.

  // Check for collision againt the triangle face:
  if (!embedded) {
    // Calculate the intersection point with the plane
    vec2.subtract(planeIntersect, start, norm)
    vec2.scale(v, vel, t0)
    vec2.add(planeIntersect, v, planeIntersect)

    // Is that point inside the triangle?
    if (pointInSegment(planeIntersect, ta, tb)) {
      trace.setCollision(t0, planeIntersect)
      // Collisions against the face will always be closer than vertex or edge collisions
      // so we can stop checking now.
      return
    }
  }

  var velSqrLen = vec2.squaredLength(vel)
  var t = trace.t

  // Check for collision againt the triangle vertices:
  t = testVertex(ta, velSqrLen, t, start, vel, trace)
  t = testVertex(tb, velSqrLen, t, start, vel, trace)

  // Check for collision against the triangle edges:
  t = testEdge(ta, tb, velSqrLen, t, start, vel, trace)
}


export default { TraceInfo, traceSphereTriangle }
