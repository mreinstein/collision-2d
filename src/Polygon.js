import pointInPoly      from 'robust-point-in-polygon'
import aabbPointOverlap from './aabb-point-overlap.js'
import { vec2 }         from 'wgpu-matrix'


export function isPointInsidePolygon (point, polygon) {
    if (!aabbPointOverlap(polygon.aabb, point))
        return false

    const OUTSIDE_POLYGON = 1
    if (pointInPoly(polygon.points, point) === OUTSIDE_POLYGON)
        return false

    return true
}


// find the closest point on the edge of a polygon to a given point.
// assumes the point is outside of the polygon
export function closestPointOnPolygon (point, polygon) {
    let closest
    
    for (let i=0; i < polygon.points.length-1; i++) {
        const c = _getClosestPoint(polygon.points[i], polygon.points[i+1], point)
        if (!closest || vec2.distance(c, point) < vec2.distance(closest, point))
            closest = c
    }

    return closest
}


// given a line defined by [A, B] and a point P, find the closest point on that line to P
// set 'segmentClamp' to true if you want the closest point on the segment, not just the line.
// from https://www.gamedev.net/forums/topic/444154-closest-point-on-a-line/3941160/
//
// This one is unused but maybe good inspiration if the prev link's logic doesn't work out:
// //https://math.stackexchange.com/questions/2193720/find-a-point-on-a-line-segment-which-is-the-closest-to-other-point-not-on-the-li
function _getClosestPoint (A, B, P, segmentClamp=true) {
    const AP = vec2.subtract(P, A)
    const AB = vec2.subtract(B, A)

    const ab2 = AB[0]*AB[0] + AB[1]*AB[1]
    const ap_ab = AP[0]*AB[0] + AP[1]*AB[1]
    let t = ap_ab / ab2

    if (segmentClamp) {
        if (t < 0.0)
            t = 0.0
        else if (t > 1.0)
            t = 1.0
    }

    return vec2.addScaled(A, AB, t)
}

///////////////////////////