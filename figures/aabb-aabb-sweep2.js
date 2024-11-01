import common         from './common.js'
import contact        from '../src/contact.js'
import aabbAabbSweep2 from '../src/aabb-aabb-sweep2.js'
import { vec2 }       from 'gl-matrix'


function init (context, width, height) {

    return {
        angle: 0,
        sweepBoxes: [
            {
                position: [ -60, 24 ],
                width: 32,
                height: 32
            },
            {
                position: [ 60, -48 ],
                width: 32,
                height: 32
            }
        ],

        sweepDeltas: [
            [ 64, -20 ],
            [ -64,50 ]
        ],

        tempBox: {
            position: [ 0, 0 ],
            width: 32,
            height: 32
        },
        ...common.init(context, width, height)
    }
}


function draw (data, dt) {
    common.clear(data)

    data.angle += 0.5 * Math.PI * dt

    const factor = (Math.cos(data.angle) + 1) * 0.5 || 1e-8

    const vA = vec2.scale([], data.sweepDeltas[0], factor)
    const vB = vec2.scale([], data.sweepDeltas[1], factor)

    const [ box1, box2 ] = data.sweepBoxes

    const c = contact()
       
    const sweep = aabbAabbSweep2(data.sweepBoxes[0], vA, data.sweepBoxes[1], vB, c)

    if (sweep) {
        // Draw a red box at the point where it was trying to move to
        let length = vec2.length(vA)
        let dir = vec2.normalize([], vA)
        common.drawRay(data, box1.position, dir, length, '#f00')
        data.tempBox.position[0] = box1.position[0] + vA[0]
        data.tempBox.position[1] = box1.position[1] + vA[1]
        common.drawAABB(data, data.tempBox, '#f00')

        length = vec2.length(vB)
        dir = vec2.normalize([], vB)
        common.drawRay(data, box2.position, dir, length, '#f00')
        data.tempBox.position[0] = box2.position[0] + vB[0]
        data.tempBox.position[1] = box2.position[1] + vB[1]
        common.drawAABB(data, data.tempBox, '#f00')
      

        // Draw a yellow box at the point it actually got to
        data.tempBox.position[0] = box1.position[0] + vA[0] * c.time
        data.tempBox.position[1] = box1.position[1] + vA[1] * c.time
        common.drawAABB(data, data.tempBox, '#ff0')

        data.tempBox.position[0] = box2.position[0] + vB[0] * c.time
        data.tempBox.position[1] = box2.position[1] + vB[1] * c.time
        common.drawAABB(data, data.tempBox, '#ff0')

        // draw a ray at the contact location
        common.drawRay(data, c.position, c.normal, 4, '#ff0', false)

    } else {

        const dir = [ 0, 0 ]
        let length

        length = vec2.length(vA)
        vec2.normalize(dir, vA)

        vec2.add(data.tempBox.position, box1.position, vA)
        common.drawAABB(data, data.tempBox, '#0f0')
        common.drawRay(data, box1.position, dir, length, '#0f0')


        length = vec2.length(vB)
        vec2.normalize(dir, vB)

        vec2.add(data.tempBox.position, box2.position, vB)
        common.drawAABB(data, data.tempBox, '#0f0')
        common.drawRay(data, box2.position, dir, length, '#0f0')
    }
    
}


export default { init, draw }
