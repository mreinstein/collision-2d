import TraceInfo      from './TraceInfo.js'
import { Pool, vec2 } from './deps.js'
import toji           from './toji-tris.js'


const traceInfo = new TraceInfo()


export default function segmentsSphereSweep1 (lines, position, radius, delta, contact) {

    const endPoint = vec2.add(Pool.malloc(), position, delta)

    traceInfo.resetTrace(position, endPoint, radius)

    for (const line of lines)
        toji.traceSphereTriangle(line[0], line[1], traceInfo)

    if (traceInfo.collision) {
        contact.time = traceInfo.t

        vec2.copy(contact.position, traceInfo.intersectPoint)
        vec2.copy(contact.normal, traceInfo.intersectTriNorm)

        vec2.negate(contact.delta, delta)
        vec2.scale(contact.delta, contact.delta, 1-contact.time)

        // TODO: store collider reference
        //contact.collider = line
    }

    Pool.free(endPoint)

    return traceInfo.collision    
}
