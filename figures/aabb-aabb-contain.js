import common          from './common.js'
import aabbAabbContain  from '../src/aabb-aabb-contain.js'


function init (context, width, height) {
    return {
        angle: 0,
        box1: {
            position: [ 0, 0 ],
            width: 160,
            height: 100
        },

        box2: {
            position: [ 0, 0 ],
            width: 40,
            height: 30
        },
        ...common.init(context, width, height)
    }
}


function draw (data, dt) {
    common.clear(data)

    data.angle += 0.2 * Math.PI * dt
    data.box2.position[0] = Math.cos(data.angle) * 80
    data.box2.position[1] = Math.sin(data.angle * 2.4) * 50

    const contained = aabbAabbContain(data.box1, data.box2)

    common.drawAABB(data, data.box1, '#666')

    if (contained)
        common.drawAABB(data, data.box2, '#0f0')
    else
        common.drawAABB(data, data.box2, '#f00')
}


export default { init, draw }
