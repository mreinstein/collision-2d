import intersects from './aabb-aabb-overlap.js'
import Pool       from 'https://cdn.jsdelivr.net/gh/mreinstein/vec2-gap/pool.js'
import * as vec2  from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.3.0/esm/vec2.js'


// Sweep two moving AABBs to see if and when they first and last were overlapping
// http://www.gamasutra.com/view/feature/131790/simple_intersection_tests_for_games.php?page=3
//
// A previous state of AABB A
// B previous state of AABB B
// va displacment vector of A
// vb displacement vector of B
export default function aabbAABBSweep2 (A, va, B, vb) {
  let u0 = 0 // normalized time of first collision
  let u1 = 0 // normalized time of second collision

  // the problem is solved in A's frame of reference

  // relative velocity (in normalized time)
  const v = Pool.malloc()
  vec2.subtract(v, vb, va)

  let u_0 = [ 0, 0 ] // first times of overlap along each axis
  let u_1 = [ 1, 1 ] // last times of overlap along each axis

  // check if they were overlapping  on the previous frame
  const collisionInfo = true
  const collision = intersects(A, B, collisionInfo)
  if (collision) {
    //u0 = u1 = 0
    return collision
  }

  // there is no movement, can't collide
  if (vec2.length(v) === 0)
    return collision

  const apos = [ A.position[0], A.position[1] ]
  const bpos = [ B.position[0], B.position[1] ]

  const ahalf = [ A.width / 2, A.height / 2 ]
  const bhalf = [ B.width / 2, B.height / 2 ]

  // find the possible first and last times of overlap along each axis
  for (let i = 0; i < 2; i++) {
    let aMax = apos[i] + ahalf[i]
    let aMin = apos[i] - ahalf[i]
    let bMax = bpos[i] + bhalf[i]
    let bMin = bpos[i] - bhalf[i]

    if (aMax < bMin && v[i] < 0)
      u_0[i] = (aMax - bMin) / v[i]
    else if (bMax < aMin && v[i] > 0)
      u_0[i] = (aMin - bMax) / v[i]

    if (bMax > aMin && v[i] < 0)
      u_1[i] = (aMin - bMax) / v[i]
    else if (aMax > bMin && v[i] > 0)
      u_1[i] = (aMax - bMin) / v[i]
  }

  u0 = Math.max(u_0[0], u_0[1])   // possible first time of overlap
  u1 = Math.min(u_1[0], u_1[1])   // possible last time of overlap

  /*
  pos  the furthest point the object A reached along the swept path before it hit
       something.
  time a copy of sweep.hit.time or 1 if the object didn’t hit anything during
       the sweep. */
  const hit = { time: 1, position: Pool.malloc() }

  // collision only occurs when the first time of overlap occurs before
  // the last time of overlap
  if (u0 <= u1) {
    hit.time = u0
    hit.position[0] = (va[0] * u0) + ahalf[0]
    hit.position[1] = (va[1] * u0) + ahalf[1]
  }
    
  return hit
}
