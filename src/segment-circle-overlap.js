import rayCircleOverlap from "./ray-circle-overlap.js";

// Calculate the intersection of a line segment and a circle
// When collision occurs, there are potentially zero to two points of intersection given by
//   p = p1 + contact.mu1 (p2 - p1)
//   p = p1 + contact.mu2 (p2 - p1)
//
// @param Object p1 vec2 1 point of the segment
// @param Object p2 vec2 1 point of the segment
// @param Object sc vec2 circle center point
// @param Number r circle radius
// @param Object contact filled in when a collision occurs. e.g., { intersectionCount: 2, mu1: 0.34885, mu2: -0.233891 }
// @returns Boolean true if there's an intersection, false otherwise
export default function segmentCircleOverlap(p1, p2, sc, r, contact) {
   const hit = rayCircleOverlap(p1, p2, sc, r, contact);

   contact.intersectionCount = 0;

   if (hit) {
      if (contact.mu1 >= 0 && contact.mu1 <= 1) contact.intersectionCount++;
      else contact.mu1 = NaN;

      if (contact.mu2 >= 0 && contact.mu2 <= 1) contact.intersectionCount++;
      else contact.mu2 = NaN;
   }

   return contact.intersectionCount > 0;
}
