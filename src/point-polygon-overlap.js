import { vec2 } from 'wgpu-matrix'


const DEFAULT_OFFSET = vec2.create()


// determine if a point is inside of a polygon.
// ray-casting (even-odd rule): shoot a ray in the +x direction and count edge
// crossings. odd = inside. handles convex and concave polygons and is
// independent of vertex winding order.
export default function pointPolygonOverlap (point, segments, polygonOffset=DEFAULT_OFFSET) {

    const px = point[0]
    const py = point[1]
    let inside = false

    for (const segment of segments) {
        const x1 = segment[0][0] + polygonOffset[0]
        const y1 = segment[0][1] + polygonOffset[1]
        const x2 = segment[1][0] + polygonOffset[0]
        const y2 = segment[1][1] + polygonOffset[1]

        // edge straddles the horizontal ray at py
        if ((y1 > py) !== (y2 > py)) {
            const xCross = x1 + (x2 - x1) * (py - y1) / (y2 - y1)
            if (px < xCross)
                inside = !inside
        }
    }

    return inside
}
