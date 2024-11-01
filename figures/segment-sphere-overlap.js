import common               from './common.js'
import segmentSphereOverlap from '../src/segment-sphere-overlap.js'
import { vec2 }             from 'gl-matrix'


function init (context, width, height) {
    return {
        angle: 0,
        ...common.init(context, width, height)
    }
}


function draw (data, dt) {
    common.clear(data)

    data.angle += 0.3 * Math.PI * dt

    const pos1 = [
        Math.cos(data.angle) * 124,
        Math.sin(data.angle) * 24
    ]

    const pos2 = [
        Math.sin(data.angle) * 32,
        Math.cos(data.angle) * 32
    ]


    const delta = vec2.subtract(vec2.create(), pos2, pos1)
    
    const sphereCenter = [ 0, 0 ]
    const sphereRadius = 31
    const contact = { mu1: NaN, mu2: NaN }

    const hit = segmentSphereOverlap(pos1, pos2, sphereCenter, sphereRadius, contact)
    

    common.drawCircle(data, sphereCenter, sphereRadius, '#666')

    if (hit) {
        common.drawSegment(data, pos1, pos2, '#f00', 1)

        const p1 = vec2.scaleAndAdd(vec2.create(), pos1, delta, contact.mu1)
        const p2 = vec2.scaleAndAdd(vec2.create(), pos1, delta, contact.mu2)
        
        common.drawPoint(data, p1, 'yellow', 'μ1', 2)
        common.drawPoint(data, p2, 'yellow', 'μ2', 2)

    } else {
        common.drawSegment(data, pos1, pos2, '#0f0', 1)
    }
    
}


export default { init, draw }
