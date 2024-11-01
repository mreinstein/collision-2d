import common           from './common.js'
import contact          from '../src/contact.js'
import aabbSegmentSweep from '../src/aabb-segment-sweep1.js'
import { vec2 }         from 'gl-matrix'


function init (context, width, height) {

    return {
        angle: 0,
       
        staticLine: [
            
            [ 50, -50 ],
            [ -20, 0 ]
        ],

        sweepAABB: {
            position: [ -32, 60 ],
            width: 32,
            height: 32
        },

        sweepDelta: [
            32, -96
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

    common.drawSegment(data, data.staticLine[0], data.staticLine[1], '#666')

    
    data.angle += 0.5 * Math.PI * dt

    const factor = (Math.cos(data.angle) + 1) * 0.5 || 1e-8

    const delta = vec2.scale([], data.sweepDelta, factor)
    const c = contact()

    const box = data.sweepAABB
    

    const sweep = aabbSegmentSweep(data.staticLine, box, delta, c)
    const length = vec2.length(delta)
    const dir = vec2.normalize([], delta)
    

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

}


export default { init, draw }
