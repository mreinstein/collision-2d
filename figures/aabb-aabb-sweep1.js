import common         from './common.js'
import contact        from '../src/contact.js'
import aabbAabbSweep1 from '../src/aabb-aabb-sweep1.js'
import { vec2 }       from 'gl-matrix'


function init (context, width, height) {

    return {
        angle: 0,
        staticBox: {
            position: [ 0, 0 ],
            width: 224,
            height: 32
        },

        sweepBoxes: [
            {
                position: [ -152, 24 ],
                width: 32,
                height: 32
            },
            {
                position: [ 128, -48 ],
                width: 32,
                height: 32
            }
        ],

        sweepDeltas: [
            [ 64, -12 ],
            [ -32, 96 ]
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

    common.drawAABB(data, data.staticBox, '#666')
    const factor = (Math.cos(data.angle) + 1) * 0.5 || 1e-8

    common.drawAABB(data, data.staticBox, '#666')

    data.sweepBoxes.forEach((box, i) => {
        const delta = vec2.scale([], data.sweepDeltas[i], factor)
        const c = contact()
        const sweep = aabbAabbSweep1(data.staticBox, box, delta, c)
        const length = vec2.length(delta)
        const dir = vec2.normalize([], delta)
        
        common.drawAABB(data, box, '#666')
 
        if (sweep) {
            // Draw a red box at the point where it was trying to move to
            common.drawRay(data, box.position, dir, length, '#f00')
            data.tempBox.position[0] = box.position[0] + delta[0]
            data.tempBox.position[1] = box.position[1] + delta[1]
            common.drawAABB(data, data.tempBox, '#f00')

            // Draw a yellow box at the point it actually got to
            data.tempBox.position[0] = box.position[0] + delta[0] * c.time
            data.tempBox.position[1] = box.position[1] + delta[1] * c.time
            common.drawAABB(data, data.tempBox, '#ff0')
            common.drawPoint(data, c.position, '#ff0')
            common.drawRay(data, c.position, c.normal, 4, '#ff0', false)
            
        } else {
            data.tempBox.position[0] = box.position[0] + delta[0]
            data.tempBox.position[1] = box.position[1] + delta[1]
            common.drawAABB(data, data.tempBox, '#0f0')
            common.drawRay(data, box.position, dir, length, '#0f0')
        }
        
    })

}


export default { init, draw }
