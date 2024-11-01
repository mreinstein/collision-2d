import raySphereOverlap from './ray-sphere-overlap.js'
import { vec2 }         from 'gl-matrix'


// Calculate the intersection of a line segment and a sphere
// When collision occurs, there are potentially zero to two points of intersection given by
//   p = p1 + contact.mu1 (p2 - p1)
//   p = p1 + contact.mu2 (p2 - p1)
//
// @param Object p1 vec2 1 point of the segment
// @param Object p2 vec2 1 point of the segment
// @param Object sc vec2 sphere center point
// @param Number r sphere radius
// @param Object contact filled in when a collision occurs. e.g., { intersectionCount: 2, mu1: 0.34885, mu2: -0.233891 }
// @returns Boolean true if there's an intersection, false otherwise
export default function segmentSphereOverlap (p1, p2, sc, r, contact) {

   const hit = raySphereOverlap(p1, p2, sc, r, contact)

   contact.intersectionCount = 0

   if (hit) {
      if (contact.mu1 >= 0 && contact.mu1 <= 1)
         contact.intersectionCount++
      else
         contact.mu1 = NaN

      if (contact.mu2 >= 0 && contact.mu2 <= 1)
         contact.intersectionCount++
      else
         contact.mu2 = NaN
   }

   return contact.intersectionCount > 0
}
