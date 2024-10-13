import { vec2 } from './deps.js'


// determine if a point is inside a sphere
export default function spherePointOverlap (point, centerA, radiusA) {
    return vec2.distance(point, centerA) <= radiusA
}
