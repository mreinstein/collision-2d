import common              from './common.js'
import sphereSphereOverlap from '../src/sphere-sphere-overlap.js'
import { vec2 }            from 'gl-matrix'


function init (context, width, height) {
    return {
        angle: 0,
        sweepBoxes: [
            {
                position: [ -60, 24 ],
                radius: 32
            },
            {
                position: [ 60, -48 ],
                radius: 32
            }
        ],

        sweepDeltas: [
            [ 64, -20 ],
            [ -64,50 ]
        ],

        ...common.init(context, width, height)
    }
}


function draw (data, dt) {
    common.clear(data)

    data.angle += 0.5 * Math.PI * dt

    const factor = (Math.cos(data.angle) + 1) * 0.5 || 1e-8

    const vA = vec2.scale([], data.sweepDeltas[0], factor)
    const vB = vec2.scale([], data.sweepDeltas[1], factor)

    const centerA = data.sweepBoxes[0].position
    const radiusA = data.sweepBoxes[0].radius

    const centerB = data.sweepBoxes[1].position
    const radiusB = data.sweepBoxes[1].radius

    const tmp1 = vec2.add([], centerA, vA)
    const tmp2 = vec2.add([], centerB, vB)

       
    const overlapping = sphereSphereOverlap(tmp1, radiusA, tmp2, radiusB)

    if (overlapping) {
        common.drawCircle(data, tmp1, radiusA, '#f00')
        common.drawCircle(data, tmp2, radiusB, '#f00')
    } else {
        common.drawCircle(data, tmp1, radiusA, '#0f0')
        common.drawCircle(data, tmp2, radiusB, '#0f0')
    }
    
}


export default { init, draw }
