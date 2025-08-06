import TraceInfo from './TraceInfo.js'
import toji      from './toji-tris.js'
import { vec2 }  from 'wgpu-matrix'


const traceInfo = new TraceInfo()
const p0 = vec2.create()
const p1 = vec2.create()
const endPoint = vec2.create()


export default function segmentsEllipsoid1Indexed (lines, indices, lineCount, position, ellipsoid, delta, contact) {

    vec2.add(position, delta, endPoint)

    const radius = 1
    traceInfo.resetTrace(position, endPoint, radius)

    let collider = -1
    for (let i=0; i < lineCount; i++) {
        const idx = indices[i]
        const line = lines[idx]
        const oldT = traceInfo.t

        vec2.divide(line[0], ellipsoid, p0)
        vec2.divide(line[1], ellipsoid, p1)

        toji.traceSphereTriangle(p0, p1, traceInfo)
        if (traceInfo.collision && oldT !== traceInfo.t)
            collider = idx
    }

    if (traceInfo.collision) {
        contact.time = traceInfo.t

        vec2.copy(traceInfo.intersectPoint, contact.position)
        vec2.copy(traceInfo.intersectTriNorm, contact.normal)

        vec2.negate(delta, contact.delta)
        vec2.scale(contact.delta, 1-contact.time, contact.delta)

        contact.collider = collider
    }

    return traceInfo.collision
}
