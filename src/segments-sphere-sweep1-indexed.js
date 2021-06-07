import TraceInfo      from './TraceInfo.js'
import { Pool, vec2 } from './deps.js'
import toji           from './toji-tris.js'


const traceInfo = new TraceInfo()


export default function segmentsSphereSweep1Indexed (lines, indices, lineCount, position, radius, delta, contact) {

    const endPoint = vec2.add(Pool.malloc(), position, delta)

    traceInfo.resetTrace(position, endPoint, radius)

    let collider = -1
    for (let i=0; i < lineCount; i++) {
        const idx = indices[i]
        const line = lines[idx]
        const oldT = traceInfo.t
        toji.traceSphereTriangle(line[0], line[1], traceInfo)
        if (traceInfo.collision && oldT !== traceInfo.t)
            collider = idx
    }

    if (traceInfo.collision) {
        contact.time = traceInfo.t

        vec2.copy(contact.position, traceInfo.intersectPoint)
        vec2.copy(contact.normal, traceInfo.intersectTriNorm)

        vec2.negate(contact.delta, delta)
        vec2.scale(contact.delta, contact.delta, 1-contact.time)

        contact.collider = collider
    }

    Pool.free(endPoint)

    return traceInfo.collision
}
