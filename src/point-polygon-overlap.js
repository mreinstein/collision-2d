import { vec2 } from 'gl-matrix'


const DEFAULT_OFFSET = vec2.create()


// determine if a point is inside of a polygon
export default function pointPolygonOverlap (point, segments, polygonOffset=DEFAULT_OFFSET) {

    for (const segment of segments) {   
        const dx = segment[1][0] - segment[0][0]
        const dy = segment[1][1] - segment[0][1]
        const startX = segment[0][0] + polygonOffset[0]
        const startY = segment[0][1] + polygonOffset[1]

        if (dx === 0) {
            const dir = Math.sign(dy)
            if ((point[0] - startX) * dir < 0)
                return false
        } else {
            const dir = Math.sign(dx)
            const slope = dy / dx
            if ((point[1] - (startY + slope * (point[0] - startX))) * dir > 0)
                return false
        }
    }

    return true
}
