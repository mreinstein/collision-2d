import TraceInfo from './TraceInfo.js'
import toji      from './toji-tris.js'
import { vec2 }  from 'gl-matrix'


const traceInfo = new TraceInfo()
const endPoint = vec2.create()


export default function segmentsSphereSweep1 (lines, position, radius, delta, contact) {

    vec2.add(endPoint, position, delta)

    traceInfo.resetTrace(position, endPoint, radius)

    let collider = -1
    for (let i=0; i < lines.length; i++) {
        const line = lines[i]
        const oldT = traceInfo.t
        toji.traceSphereTriangle(line[0], line[1], traceInfo)
        if (traceInfo.collision && oldT !== traceInfo.t)
            collider = i
    }

    if (traceInfo.collision) {
        contact.time = traceInfo.t

        vec2.copy(contact.position, traceInfo.intersectPoint)
        vec2.copy(contact.normal, traceInfo.intersectTriNorm)

        vec2.negate(contact.delta, delta)
        vec2.scale(contact.delta, contact.delta, 1-contact.time)

        contact.collider = collider
    }

    return traceInfo.collision    
}
