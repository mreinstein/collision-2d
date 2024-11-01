import lineNormal from './segment-normal.js'
import segseg     from './segment-segment-overlap.js'
import { vec2 }   from 'gl-matrix'


const EPSILON = 1e-8
const isect = vec2.create() // the intersection if there is one
const end = vec2.create()


export default function segmentsSegmentOverlap (lines, start, delta, contact) {
    let nearest, nearestTime = 0, nearestIdx = -1

    vec2.set(end, start[0] + delta[0], start[1] + delta[1])

    for (let i=0; i < lines.length; i++) {
        const line = lines[i];
        if (segseg(start, end, line[0], line[1], isect)) {
            const dist = vec2.distance(start, isect)
            if (!nearest || dist < nearestTime) {
                nearestTime = dist
                nearest = line
                nearestIdx = i
            }
        }
    }

    let nearTime = nearestTime / vec2.length(delta)
    if (nearTime > 1)
        return false

    if (nearTime <= EPSILON)
        nearTime = 0

    if (nearest) {
        vec2.scaleAndAdd(contact.position, start, delta, nearTime)
        contact.collider = nearestIdx

        // determine which normal is on the right side of the plane for the intersection
        lineNormal(contact.normal, nearest[0], nearest[1])

        // if dot product is less than 0, flip the normal 180 degrees
        const dot = vec2.dot(delta, contact.normal)
        if (dot > 0)
            vec2.negate(contact.normal, contact.normal)

        contact.time = nearTime
    }

    return !!nearest
}
