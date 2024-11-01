// based on https://gamedev.stackexchange.com/questions/29479/swept-aabb-vs-line-segment-2d

import segmentNormal  from './segment-normal.js'
import { sign } from '@footgun/math-gap'
import { vec2 } from 'gl-matrix'


const aabbCenter = vec2.create()
const aabbMin = vec2.create()
const aabbMax = vec2.create()
const lineNormal = vec2.create()
const lineDir = vec2.create()
const lineMin = vec2.create()
const lineMax = vec2.create()
const lineAabbDist = vec2.create()
const hitNormal = vec2.create()
const normalizedDelta = vec2.create()

const PADDING = 0.005

// sweep a moving aabb against a line segment
//
//@param line non-moving line segment
//@param aabb moving box
//@param vec2 delta movement vector of the aabb
//@param object contact optional contact data structure filled on hit
//@return boolean true when the box hits the segment
export default function aabbSegmentSweep1 (line, aabb, delta, contact) {
    
    vec2.copy(aabbCenter, aabb.position)
    vec2.set(aabbMin, aabb.position[0] - aabb.width/2, aabb.position[1] - aabb.height/2)
    vec2.set(aabbMax, aabb.position[0] + aabb.width/2, aabb.position[1] + aabb.height/2)

    vec2.normalize(normalizedDelta, delta)

    // calculate line bounds
    vec2.subtract(lineDir,line[1],line[0])
    if (lineDir[0] > 0) {
        // right
        lineMin[0] = line[0][0]
        lineMax[0] = line[1][0]

    } else {
        // left
        lineMin[0] = line[1][0]
        lineMax[0] = line[0][0]
    }

    if (lineDir[1] > 0) {
        // down
        lineMin[1] = line[0][1]
        lineMax[1] = line[1][1]

    } else {
        // up
        lineMin[1] = line[1][1]
        lineMax[1] = line[0][1]
    }

    // get aabb's center to line[0] distance
    vec2.subtract(lineAabbDist, line[0], aabbCenter)

    // get the line's normal
    // if the dot product of it and the delta is larger than 0,
    // it means the line's normal is facing away from the sweep
    segmentNormal(lineNormal, line[0], line[1])
    vec2.copy(hitNormal, lineNormal)

    let hitTime = 0 // first overlap time
    let outTime = 1 // last overlap time

    // calculate the radius of the box in respect to the line normal
    let r = (aabb.width/2) * Math.abs(lineNormal[0]) + (aabb.height/2) * Math.abs(lineNormal[1])

    // distance from box to line in respect to the line normal
    const boxProj = vec2.dot(lineAabbDist, lineNormal)

    // velocity, projected on the line normal
    const velProj = vec2.dot(delta, lineNormal)

    // inverse the radius if required
    if (velProj < 0)
        r *= -1

    // calculate first and last overlap times,
    // as if we're dealing with a line rather than a segment
    hitTime = Math.max((boxProj - r) / velProj, hitTime)
    outTime = Math.min((boxProj + r) / velProj, outTime)

    // run standard AABBvsAABB sweep 
    // against an AABB constructed from the extents of the line segment
    // X axis overlap
    if (delta[0] < 0) {
        // sweeping left
        if (aabbMax[0] < lineMin[0])
            return false

        const hit = (lineMax[0] - aabbMin[0]) / delta[0]
        const out = (lineMin[0] - aabbMax[0]) / delta[0]
        outTime = Math.min(out, outTime)
        if (hit >= hitTime && hit <= outTime) {
            // box is hitting the line on its end:
            // adjust the normal accordingly
            vec2.set(hitNormal, 1, 0)
        }
        hitTime = Math.max(hit, hitTime)

    } else if (delta[0] > 0) {
        // sweeping right
        if (aabbMin[0] > lineMax[0])
            return false

        const hit = (lineMin[0] - aabbMax[0]) / delta[0]
        const out = (lineMax[0] - aabbMin[0]) / delta[0]
        outTime = Math.min(out, outTime)
        if (hit >= hitTime && hit <= outTime)
            vec2.set(hitNormal, -1, 0)

        hitTime = Math.max(hit, hitTime)

    } else if (lineMin[0] > aabbMax[0] || lineMax[0] < aabbMin[0]) {
        return false
    }

    if ( hitTime > outTime )
        return false

    // Y axis overlap
    if (delta[1] < 0) {
        // sweeping up
        if (aabbMax[1] < lineMin[1])
            return false

        const hit = (lineMax[1] - aabbMin[1]) / delta[1]
        const out = (lineMin[1] - aabbMax[1]) / delta[1]
        outTime = Math.min(out, outTime)
        if (hit >= hitTime && hit <= outTime)
            vec2.set(hitNormal, 0, 1)

        hitTime = Math.max(hit, hitTime)

    } else if (delta[1] > 0) {
        // sweeping down
        if (aabbMin[1] > lineMax[1])
            return false

        const hit = (lineMin[1] - aabbMax[1]) / delta[1]
        const out = (lineMax[1] - aabbMin[1]) / delta[1]
        outTime = Math.min(out, outTime)
        if (hit >= hitTime && hit <= outTime)
            vec2.set(hitNormal, 0, -1)

        hitTime = Math.max(hit, hitTime)

    } else if (lineMin[1] > aabbMax[1] || lineMax[1] < aabbMin[1]) {
        return false
    }

    if (hitTime > outTime)
        return false

    // ignore this line if its normal is facing away from the sweep delta
    // check for this only at this point to account for a possibly changed hitNormal
    // from a hit on the line's end
    //
    // also ignore this line its normal is facing away from the adjusted hitNormal
    if (vec2.dot(normalizedDelta, hitNormal) > 0 || vec2.dot(lineNormal, hitNormal) < 0)
        return false
   
    if (contact) {
        const deltaX = delta[0] * hitTime + (PADDING * hitNormal[0])
        const deltaY = delta[1] * hitTime + (PADDING * hitNormal[1])
        vec2.set(contact.delta, deltaX, deltaY)
        vec2.add(contact.position, aabb.position, contact.delta)
        vec2.copy(contact.normal, hitNormal)
        contact.collider = line
        contact.time = hitTime
    }

    return true
}
