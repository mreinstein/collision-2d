import common          from './common.js'
import contact         from '../src/contact.js'
import aabbAabbOverlap from '../src/aabb-aabb-overlap.js'


function init (context, width, height) {
    return {
        angle: 0,
        box1: {
            position: [ 0, 0 ],
            width: 128,
            height: 32
        },

        box2: {
            position: [ 0, 0 ],
            width: 32,
            height: 32
        },
        ...common.init(context, width, height)
    }
}


function draw (data, dt) {
    common.clear(data)

    data.angle += 0.2 * Math.PI * dt
    data.box2.position[0] = Math.cos(data.angle) * 96
    data.box2.position[1] = Math.sin(data.angle * 2.4) * 24


    const c = contact()
    const hit = aabbAabbOverlap(data.box1, data.box2, c)

    common.drawAABB(data, data.box1, '#666')

    if (hit) {
      common.drawAABB(data, data.box2, '#f00')
      data.box2.position[0] += c.delta[0]
      data.box2.position[1] += c.delta[1]
      common.drawAABB(data, data.box2, '#ff0')
      common.drawPoint(data, c.position, '#ff0')
      common.drawRay(data, c.position, c.normal, 4, '#ff0', false)
    } else {
      common.drawAABB(data, data.box2, '#0f0')
    }
}


export default { init, draw }
