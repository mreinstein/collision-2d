import dist from 'point-to-segment-2d'


// p - point
// t0 - start point of segment
// t1 - end point of segment
// return boolean indicating if p is on the segment
export default function segmentPointOverlap (p, t0, t1) {
    return dist(p, t0, t1) <= 0
}
