import { vec2 } from 'gl-matrix'


// from http://paulbourke.net/geometry/circlesphere/raysphere.c

const EPSILON = 1e-8

const dp = [ 0, 0 ]


// Calculate the intersection of an infinite ray and a sphere
// When collision occurs, there are potentially two points of intersection given by
//   p = p1 + contact.mu1 (p2 - p1)
//   p = p1 + contact.mu2 (p2 - p1)
//
// @param Object p1 vec2 1 point of the segment on the infinite ray
// @param Object p2 vec2 1 point of the segment on the infinite ray
// @param Object sc vec2 sphere center point
// @param Number r sphere radius
// @param Object contact filled in when a collision occurs. e.g., { mu1: 0.34885, mu2: -0.233891 }
// @returns Boolean true if there's an intersection, false otherwise
export default function raySphereOverlap (p1, p2, sc, r, contact) {

   vec2.subtract(dp, p2, p1)
   
   const a = dp[0] * dp[0] + dp[1] * dp[1]
   const b = 2 * (dp[0] * (p1[0] - sc[0]) + dp[1] * (p1[1] - sc[1]))
   let c = sc[0] * sc[0] + sc[1] * sc[1]
   c += p1[0] * p1[0] + p1[1] * p1[1]
   c -= 2 * (sc[0] * p1[0] + sc[1] * p1[1])
   c -= r * r;

   const bb4ac = b * b - 4 * a * c

   if (Math.abs(a) < EPSILON || bb4ac < 0) {
      contact.mu1 = 0
      contact.mu2 = 0
      return false
   }

   contact.mu1 = (-b + Math.sqrt(bb4ac)) / (2 * a)
   contact.mu2 = (-b - Math.sqrt(bb4ac)) / (2 * a)

   return true
}
