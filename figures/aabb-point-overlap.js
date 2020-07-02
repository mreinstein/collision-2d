import common           from './common.js'
import contact          from '../src/contact.js'
import aabbPointOverlap from '../src/aabb-point-overlap.js'


function init (context, width, height) {
    return {
        angle: 0,
        pos: [ 0, 0 ],
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
    data.pos[0] = Math.cos(data.angle * 0.4) * 32
    data.pos[1] = Math.sin(data.angle) * 12
    
    const c = contact()
    const hit = aabbPointOverlap(data.box, data.pos, c)
    common.drawAABB(data, data.box, '#666')

    const pointWidth = 1

    if (hit) {
      common.drawPoint(data, data.pos, '#f00', '', pointWidth)
      common.drawPoint(data, c.position, '#ff0', '', pointWidth)
    } else {
      common.drawPoint(data, data.pos, '#0f0', '', pointWidth)
    }
}


export default { init, draw }
