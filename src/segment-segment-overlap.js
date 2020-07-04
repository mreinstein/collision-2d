import segmentPointOverlap from './segment-point-overlap.js'
import { vec2 }            from './deps.js'


function SAME_SIGNS (a, b) {
    return a ^ b >= 0
}


/*  Ported from Mukesh Prasad's public domain code:
 *    http://www.realtimerendering.com/resources/GraphicsGems/gemsii/xlines.c
 *
 *   This function computes whether two line segments,
 *   respectively joining the input points (pos1) -- (pos2)
 *   and the input points (pos3) -- (pos4) intersect.
 *   If the lines intersect, the intersection argument is an array
 *   filled in with the coordinates of the point of intersection.
 *
 *   Params
 *        pos1, pos2    Coordinates of endpoints of one segment.
 *        pos3, pos4    Coordinates of endpoints of other segment.
 *        intersection  vec2 that gets filled in with the point of intersection
 *
 *   The value returned by the function is one of:
 *        false if there is no intersection or the lines are colinear
 *        true if there's an intersection
 */

function segmentSegmentOverlap (pos1, pos2, pos3, pos4, intersection) {
    let x1 = pos1[0];
    let y1 = pos1[1];
    let x2 = pos2[0];
    let y2 = pos2[1];
    let x3 = pos3[0];
    let y3 = pos3[1];
    let x4 = pos4[0];
    let y4 = pos4[1];


    let a1, a2, b1, b2, c1, c2; // Coefficients of line eqns.
    let r1, r2, r3, r4;         // 'Sign' values
    let denom, offset;          // Intermediate values
    let x, y;                   // Intermediate return values

    // Compute a1, b1, c1, where line joining points 1 and 2
    // is "a1 x  +  b1 y  +  c1  =  0".
    a1 = y2 - y1;
    b1 = x1 - x2;
    c1 = x2 * y1 - x1 * y2;

    // Compute r3 and r4.
    r3 = a1 * x3 + b1 * y3 + c1;
    r4 = a1 * x4 + b1 * y4 + c1;
    

    // Check signs of r3 and r4.  If both point 3 and point 4 lie on
    // same side of line 1, the line segments do not intersect.
    if ( r3 !== 0 && r4 !== 0 && SAME_SIGNS(r3, r4)) {
        return false; // no intersection
    }


    // Compute a2, b2, c2
    a2 = y4 - y3;
    b2 = x3 - x4;
    c2 = x4 * y3 - x3 * y4;

    // Compute r1 and r2
    r1 = a2 * x1 + b2 * y1 + c2;
    r2 = a2 * x2 + b2 * y2 + c2;

    // Check signs of r1 and r2.  If both point 1 and point 2 lie
    // on same side of second line segment, the line segments do
    // not intersect.
    if (r1 !== 0 && r2 !== 0 && SAME_SIGNS(r1, r2))
        return false; // no intersections

    // Line segments intersect: compute intersection point.
    denom = a1 * b2 - a2 * b1;

    // colinear
    if ( denom === 0 )
        return true;

    offset = denom < 0 ? - denom / 2 : denom / 2;

    x = b1 * c2 - b2 * c1;
    y = a2 * c1 - a1 * c2;

    if (intersection)
        vec2.set(intersection,
                ( x < 0 ? x : x ) / denom,
                ( y < 0 ? y : y ) / denom)

    return true
}


export default function overlap (pos1, pos2, pos3, pos4, intersection) {
    if (segmentSegmentOverlap(pos1, pos2, pos3, pos4, intersection))
        return true

    // when we get here, the 2 segments don't overlap, but one of the segment's points
    // may lie on the other segment. compare all 4 points to see if any lie on the other segment
    if (segmentPointOverlap(pos1, pos3, pos4)) {
        vec2.copy(intersection, pos1)
        return true
    }

    if (segmentPointOverlap(pos2, pos3, pos4)) {
        vec2.copy(intersection, pos2)
        return true
    }

    if (segmentPointOverlap(pos3, pos1, pos2)) {
        vec2.copy(intersection, pos3)
        return true
    }

    if (segmentPointOverlap(pos4, pos1, pos2)) {
        vec2.copy(intersection, pos4)
        return true
    }

    return false
}
