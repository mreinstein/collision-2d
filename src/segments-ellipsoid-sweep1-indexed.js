import TraceInfo from './TraceInfo.js'
import toji      from './toji-tris.js'
import { vec2 }  from 'gl-matrix'


const traceInfo = new TraceInfo()
const p0 = vec2.create()
const p1 = vec2.create()
const endPoint = vec2.create()


export default function segmentsEllipsoid1Indexed (lines, indices, lineCount, position, ellipsoid, delta, contact) {

    vec2.add(endPoint, position, delta)

    const radius = 1
    traceInfo.resetTrace(position, endPoint, radius)

    let collider = -1
    for (let i=0; i < lineCount; i++) {
        const idx = indices[i]
        const line = lines[idx]
        const oldT = traceInfo.t

        vec2.divide(p0, line[0], ellipsoid)
        vec2.divide(p1, line[1], ellipsoid)

        toji.traceSphereTriangle(p0, p1, traceInfo)
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

    return traceInfo.collision
}
