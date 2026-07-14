import common     from './common.js'
import contact     from '../src/contact.js'
import obbOverlap  from '../src/obb-obb-overlap.js'


function init (context, width, height) {
    return {
        angle: 0,
        box1: {
            position: [ 0, 0 ],
            width: 128,
            height: 40,
            rotation: Math.PI / 8
        },

        box2: {
            position: [ 0, 0 ],
            width: 44,
            height: 44,
            rotation: 0
        },
        ...common.init(context, width, height)
    }
}


function draw (data, dt) {
    common.clear(data)

    data.angle += 0.2 * Math.PI * dt
    data.box2.position[0] = Math.cos(data.angle) * 96
    data.box2.position[1] = Math.sin(data.angle * 2.4) * 24
    data.box2.rotation = data.angle * 1.3
    data.box1.rotation = Math.PI / 8 + data.angle * 0.6


    const c = contact()
    const hit = obbOverlap(data.box1, data.box2, c)

    common.drawOBB(data, data.box1, '#666')

    if (hit) {
      common.drawOBB(data, data.box2, '#f00')
      data.box2.position[0] += c.delta[0]
      data.box2.position[1] += c.delta[1]
      common.drawOBB(data, data.box2, '#ff0')
      common.drawPoint(data, c.position, '#ff0')
      common.drawRay(data, c.position, c.normal, 4, '#ff0', false)
    } else {
      common.drawOBB(data, data.box2, '#0f0')
    }
}


export default { init, draw }
