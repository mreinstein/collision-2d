import { vec2 } from "wgpu-matrix";

// determine if a point is inside a circle
export default function circlePointOverlap(point, centerA, radiusA) {
    return vec2.distance(point, centerA) <= radiusA;
}
