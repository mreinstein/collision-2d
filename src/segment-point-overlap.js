import { segpoint } from './deps.js'


// p - point
// t0 - start point of segment
// t1 - end point of segment
export default function segmentPointOverlap (p, t0, t1) {
    return segpoint(p, t0, t1)
}
