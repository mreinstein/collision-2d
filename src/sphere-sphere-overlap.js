import { vec2 } from './deps.js'


// @return bool true if the spheres overlap, false otherwise
export default function sphereSphereOverlap (centerA, radiusA, centerB, radiusB) {
    return vec2.distance(centerA, centerB) <= (radiusA + radiusB)
}
