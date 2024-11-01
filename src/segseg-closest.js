// determine the closest point between 2 line segments.
// from http://geomalgorithms.com/a07-_distance.html#dist3D_Segment_to_Segment
import { vec2 } from 'gl-matrix'


const SMALL_NUM = 0.00000001 // anything that avoids division overflow

const u = vec2.create()
const v = vec2.create()
const w = vec2.create()
const s1tmp = vec2.create()
const s2tmp = vec2.create()
const diff = vec2.create()
const dP = vec2.create()


// get the 2D minimum distance between 2 segments
//    Input:  two 2D line segments S1 and S2
//    Return: the shortest distance between S1 and S2

export default function segSegClosest (S1, S2, detail) {
    vec2.subtract(u, S1[1], S1[0])
    vec2.subtract(v, S2[1], S2[0])
    vec2.subtract(w, S1[0], S2[0])

    //Vector   u = S1[1] - S1[0];
    //Vector   v = S2[1] - S2[0];
    //Vector   w = S1[0] - S2[0];


    const a = vec2.dot(u, u)
    const b = vec2.dot(u, v)
    const c = vec2.dot(v, v)
    const d = vec2.dot(u, w)
    const e = vec2.dot(v, w)
    const D = a*c - b*b

    //float    a = dot(u,u);         // always >= 0
    //float    b = dot(u,v);
    //float    c = dot(v,v);         // always >= 0
    //float    d = dot(u,w);
    //float    e = dot(v,w);
    //float    D = a*c - b*b;        // always >= 0


    let sN, sD = D
    let tN, tD = D

    //float    sc, sN, sD = D;       // sc = sN / sD, default sD = D >= 0
    //float    tc, tN, tD = D;       // tc = tN / tD, default tD = D >= 0


    // compute the line parameters of the two closest points
    if (D < SMALL_NUM) { // the lines are almost parallel
        sN = 0.0;         // force using point P0 on segment S1
        sD = 1.0;         // to prevent possible division by 0.0 later
        tN = e;
        tD = c;
    }
    else {                 // get the closest points on the infinite lines
        sN = (b*e - c*d);
        tN = (a*e - b*d);
        if (sN < 0.0) {        // sc < 0 => the s=0 edge is visible
            sN = 0.0;
            tN = e;
            tD = c;
        }
        else if (sN > sD) {  // sc > 1  => the s=1 edge is visible
            sN = sD;
            tN = e + b;
            tD = c;
        }
    }

    if (tN < 0.0) {            // tc < 0 => the t=0 edge is visible
        tN = 0.0;
        // recompute sc for this edge
        if (-d < 0.0)
            sN = 0.0;
        else if (-d > a)
            sN = sD;
        else {
            sN = -d;
            sD = a;
        }
    }
    else if (tN > tD) {      // tc > 1  => the t=1 edge is visible
        tN = tD;
        // recompute sc for this edge
        if ((-d + b) < 0.0)
            sN = 0;
        else if ((-d + b) > a)
            sN = sD;
        else {
            sN = (-d +  b);
            sD = a;
        }
    }

    // do the division to get sc and tc
    // these are the distances on the lines from 0..1 where the lines are closest
    // sc is for line 1 (S1)   and tc is for line 2 (S2)
    const sc = (Math.abs(sN) < SMALL_NUM ? 0.0 : sN / sD)
    const tc = (Math.abs(tN) < SMALL_NUM ? 0.0 : tN / tD)

    if (sc > 1)
        console.warn('WARNING: sc > 1:', sc)

    if (tc > 1)
        console.warn('WARNING: tc > 1:', tc)

    vec2.scale(s1tmp, u, sc)

    vec2.scale(s2tmp, v, tc)

    vec2.subtract(diff, s1tmp, s2tmp)

    vec2.add(dP, w, diff)

    const closestDistance = vec2.length(dP)

    if (detail) {
        detail.sc = sc
        detail.tc = tc
        detail.closestDistance = closestDistance
    }
    
    // get the difference of the two closest points
    //Vector   dP = w + (sc * u) - (tc * v);  // =  S1(sc) - S2(tc)

    return closestDistance

    //return norm(dP);   // return the closest distance    sqrt(dot(v,v))
}
