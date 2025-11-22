// from https://github.com/kevzettler/gl-swept-circle-triangle
import clamp from "clamp";
import TraceInfo from "./TraceInfo.js";
import getLowestRoot from "./get-lowest-root.js";
import lineNormal from "./segment-normal.js";
import segmentPointOverlap from "./segment-point-overlap.js";
import { vec2 } from "wgpu-matrix";

const ta = vec2.create();
const tb = vec2.create();

const norm = vec2.create();

const v = vec2.create();
const edge = vec2.create();

const planeIntersect = vec2.create();

function testVertex(p, velSqrLen, t, start, vel, trace) {
  vec2.subtract(start, p, v);
  const b = 2.0 * vec2.dot(vel, v);
  const c = vec2.lengthSq(v) - 1.0;
  const newT = getLowestRoot(velSqrLen, b, c, t);
  if (newT !== null) {
    trace.setCollision(newT, p);
    return newT;
  }
  return t;
}

function testEdge(pa, pb, velSqrLen, t, start, vel, trace) {
  vec2.subtract(pb, pa, edge);
  vec2.subtract(pa, start, v);

  const edgeSqrLen = vec2.lengthSq(edge);
  const edgeDotVel = vec2.dot(edge, vel);
  const edgeDotCircleVert = vec2.dot(edge, v);

  const a = edgeSqrLen * -velSqrLen + edgeDotVel * edgeDotVel;
  const b =
    edgeSqrLen * (2.0 * vec2.dot(vel, v)) -
    2.0 * edgeDotVel * edgeDotCircleVert;
  const c =
    edgeSqrLen * (1.0 - vec2.lengthSq(v)) +
    edgeDotCircleVert * edgeDotCircleVert;

  // Check for intersection against infinite line
  const newT = getLowestRoot(a, b, c, t);
  if (newT !== null && newT < trace.t) {
    // Check if intersection against the line segment:
    const f = (edgeDotVel * newT - edgeDotCircleVert) / edgeSqrLen;
    if (f >= 0.0 && f <= 1.0) {
      vec2.scale(edge, f, v);
      vec2.add(pa, v, v);
      trace.setCollision(newT, v);
      return newT;
    }
  }
  return t;
}

/**
 * @param {vec2} a First line vertex
 * @param {vec2} b Second line vertex
 * @param {TraceInfo} trace TraceInfo containing the circle path to trace
 */
function traceCircleTriangle(a, b, trace) {
  vec2.copy(a, trace.tmpTri[0]);
  vec2.copy(b, trace.tmpTri[1]);

  const invRadius = trace.invRadius;
  const vel = trace.scaledVel;
  const start = trace.scaledStart;

  // Scale the triangle points so that we're colliding against a unit-radius circle.
  vec2.scale(a, invRadius, ta);
  vec2.scale(b, invRadius, tb);

  lineNormal(norm, ta, tb);

  vec2.copy(norm, trace.tmpTriNorm);
  const planeD = -(norm[0] * ta[0] + norm[1] * ta[1]);

  // Colliding against the backface of the triangle
  if (vec2.dot(norm, trace.normVel) >= 0) {
    // Two choices at this point:

    // 1) Negate the normal so that it always points towards the start point
    // This feels kludgy, but I'm not sure if there's a better alternative
    /*vec2.negate(norm, norm)
       planeD = -planeD*/

    // 2) Or allow it to pass through
    return;
  }

  // Get interval of plane intersection:
  let t0, t1;
  let embedded = false;

  // Calculate the signed distance from circle
  // position to triangle plane
  const distToPlane = vec2.dot(start, norm) + planeD;

  // cache this as we’re going to use it a few times below:
  const normDotVel = vec2.dot(norm, vel);

  if (normDotVel === 0.0) {
    // Circle is travelling parrallel to the plane:
    if (Math.abs(distToPlane) >= 1.0) {
      // Circle is not embedded in plane, No collision possible
      return;
    } else {
      // Circle is completely embedded in plane.
      // It intersects in the whole range [0..1]
      embedded = true;
      t0 = 0.0;
      t1 = 1.0;
    }
  } else {
    // Calculate intersection interval:
    t0 = (-1.0 - distToPlane) / normDotVel;
    t1 = (1.0 - distToPlane) / normDotVel;
    // Swap so t0 < t1
    if (t0 > t1) {
      const temp = t1;
      t1 = t0;
      t0 = temp;
    }
    // Check that at least one result is within range:
    if (t0 > 1.0 || t1 < 0.0) {
      // No collision possible
      return;
    }

    t0 = clamp(t0, 0.0, 1.0);
    t1 = clamp(t1, 0.0, 1.0);
  }

  // If the closest possible collision point is further away
  // than an already detected collision then there's no point
  // in testing further.
  //
  // this is a cheaper way to sort time of intersections, by only
  // keeping the closest one.
  if (t0 >= trace.t) return;

  // t0 and t1 now represent the range of the circle movement
  // during which it intersects with the triangle plane.
  // Collisions cannot happen outside that range.

  // Check for collision againt the triangle face:
  if (!embedded) {
    // Calculate the intersection point with the plane
    vec2.subtract(start, norm, planeIntersect);
    vec2.scale(vel, t0, v);
    vec2.add(v, planeIntersect, planeIntersect);

    // Is that point inside the triangle?
    if (segmentPointOverlap(planeIntersect, ta, tb)) {
      trace.setCollision(t0, planeIntersect);
      // Collisions against the face will always be closer than vertex or edge collisions
      // so we can stop checking now.
      return;
    }
  }

  const velSqrLen = vec2.lengthSq(vel);
  let t = trace.t;

  // Check for collision againt the triangle vertices:
  t = testVertex(ta, velSqrLen, t, start, vel, trace);
  t = testVertex(tb, velSqrLen, t, start, vel, trace);

  // Check for collision against the triangle edges:
  t = testEdge(ta, tb, velSqrLen, t, start, vel, trace);
}

export default { TraceInfo, traceCircleTriangle };
