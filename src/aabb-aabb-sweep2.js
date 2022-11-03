import aabbAABBOverlap from './aabb-aabb-overlap.js'
import aabbAabbSweep1  from './aabb-aabb-sweep1.js' 
import { Pool, vec2 }  from './deps.js'


// Sweep two moving AABBs to see if and when they first and last were overlapping
// https://www.gamedeveloper.com/disciplines/simple-intersection-tests-for-games
//
// A previous state of AABB A
// B previous state of AABB B
// va displacment vector of A
// vb displacement vector of B
// contact
export default function aabbAABBSweep2 (A, va, B, vb, contact) {
    const delta = vec2.subtract([], vb, va)
    const hit = aabbAabbSweep1(A, B, delta, contact)

    if (hit) {
       // tweak collision position
       
       contact.position[0] = A.position[0] + va[0] * contact.time
       contact.position[1] = A.position[1] + va[1] * contact.time

       const pos2 = Pool.malloc()
       pos2[0] = B.position[0] + vb[0] * contact.time
       pos2[1] = B.position[1] + vb[1] * contact.time

       const dir = vec2.subtract(Pool.malloc(), pos2, contact.position)
       const amt = vec2.scale(Pool.malloc(), dir, 0.5)

       contact.position[0] += amt[0]
       contact.position[1] += amt[1]

       Pool.free(dir)
       Pool.free(amt)
       Pool.free(pos2)
    }

    return hit
}
