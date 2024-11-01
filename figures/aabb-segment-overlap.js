import common           from './common.js'
import contact          from '../src/contact.js'
import intersectSegment from '../src/aabb-segment-overlap.js'
import { vec2 }         from 'gl-matrix'


function init (context, width, height) {
    return {
        angle: 0,
        box: {
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

    const pos1 = [
        Math.cos(data.angle) * 64,
        Math.sin(data.angle) * 64
    ]

    const pos2 = [
        Math.sin(data.angle) * 32,
        Math.cos(data.angle) * 32
    ]

    const delta = [ pos2[0] - pos1[0], pos2[1] - pos1[1] ]

    const c = contact()
    const paddingX = 0
    const paddingY = 0
    const hit = intersectSegment(data.box, pos1, delta, paddingX, paddingY, c)
    
    const length = vec2.length(delta)
    const dir = vec2.normalize([], delta) //[ delta[0], delta[1] ]

    common.drawAABB(data, data.box, '#666')

    if (hit) {
        common.drawRay(data, pos1, dir, length, '#f00')
        common.drawSegment(data, pos1, c.position, '#ff0')
        common.drawPoint(data, c.position, '#ff0')
        common.drawRay(data, c.position, c.normal, 6, '#ff0', false)
    } else {
        common.drawRay(data, pos1, dir, length, '#0f0')
    }
}


export default { init, draw }
