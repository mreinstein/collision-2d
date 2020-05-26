// adapted from https://github.com/tmpvar/segseg
import { vec2 } from './deps.js'


/*  Ported from Mukesh Prasad's public domain code:
 *    http://tog.acm.org/resources/GraphicsGems/gemsii/xlines.c
 *
 *   This function computes whether two line segments,
 *   respectively joining the input points (pos1) -- (pos2)
 *   and the input points (pos3) -- (pos4) intersect.
 *   If the lines intersect, the intersection argument is an array
 *   filled in with the coordinates of the point of intersection.
 *
 *   Params
 *        pos1,  pos2   Coordinates of endpoints of one segment.
 *        pos3,  pos4   Coordinates of endpoints of other segment.
 *        intersection  vec2 that gets filled in with the point of intersection
 *
 *   The value returned by the function is one of:
 *        false if there is no intersection or the lines are colinear
 *        true if there's an intersection
 */

 export default function segmentSegmentOverlap (pos1, pos2, pos3, pos4, intersection) {
    // Compute a1, b1, c1, where line joining points 1 and 2
    // is "a1 x  +  b1 y  +  c1  =  0".
    const a1 = pos2[1] - pos1[1];
    const b1 = pos1[0] - pos2[0];
    const c1 = pos2[0] * pos1[1] - pos1[0] * pos2[1];

    // Compute r3 and r4.
    const r3 = a1 * pos3[0] + b1 * pos3[1] + c1;
    const r4 = a1 * pos4[0] + b1 * pos4[1] + c1;

    // Check signs of r3 and r4.  If both point 3 and point 4 lie on
    // same side of line 1, the line segments do not intersect.
    if ( r3 !== 0 && r4 !== 0 && ((r3 >= 0 && r4 >= 0) || (r3 < 0 && r4 < 0)))
        return false; // no intersection

    const a2 = pos4[1] - pos3[1];
    const b2 = pos3[0] - pos4[0];
    const c2 = pos4[0] * pos3[1] - pos3[0] * pos4[1];

    const r1 = a2 * pos1[0] + b2 * pos1[1] + c2;
    const r2 = a2 * pos2[0] + b2 * pos2[1] + c2;

    // Check signs of r1 and r2.  If both point 1 and point 2 lie
    // on same side of second line segment, the line segments do
    // not intersect.
    if (r1 !== 0 && r2 !== 0 && ((r1 >= 0 && r2 >= 0) || (r1 < 0 && r2 < 0)))
        return false; // no intersections

    // Line segments intersect: compute intersection point.
    const denom = a1 * b2 - a2 * b1;

    if ( denom === 0 )
        return false;  // the lines are colinear

    const offset = denom < 0 ? - denom / 2 : denom / 2;

    if (intersection) {
        const x = b1 * c2 - b2 * c1;
        const y = a2 * c1 - a1 * c2;
        vec2.set(intersection, ( x < 0 ? x : x ) / denom, ( y < 0 ? y : y ) / denom);
    }
    
    return true;
}
