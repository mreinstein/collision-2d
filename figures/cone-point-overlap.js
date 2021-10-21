import common          from './common.js'
import conePointOverlap from '../src/cone-point-overlap.js'


function init (context, width, height) {
    return {
        angle: 0,
        pos: [ 0, 0 ],
        tri: [
            [ 0, -20 ],
            [ -20, 20 ],
            [ 20, 20 ]
        ],
        cone: {
            position: [ 0, 0 ],
            rotation: 0,
            fieldOfView: 80,
            minDistance: 10,
            maxDistance: 40
        },
        ...common.init(context, width, height)
    }
}


function draw (data, dt) {
    common.clear(data)

    data.angle += 0.5 * Math.PI * dt
    data.pos[0] = 30 + Math.cos(data.angle * 0.4) * 32
    data.pos[1] = Math.sin(data.angle) * 12

    common.drawCone(data, data.cone.position, data.cone.rotation, data.cone.fieldOfView, data.cone.minDistance, data.cone.maxDistance)

    const pointWidth = 1

    /*
    const overlapping = triPointOverlap(data.tri[0], data.tri[1], data.tri[2], data.pos)

    common.drawTriangle(data, data.tri[0], data.tri[1], data.tri[2], '#666')

    if (overlapping)
      common.drawPoint(data, data.pos, '#f00', '', pointWidth)
    else
      common.drawPoint(data, data.pos, '#0f0', '', pointWidth)
    */

    const pc = conePointOverlap(data.cone.position, data.cone.rotation, data.cone.fieldOfView, data.cone.minDistance, data.cone.maxDistance, data.pos) ? '#0f0' : '#f00'

    common.drawPoint(data, data.pos, pc, '', pointWidth)

    //data.cone.rotation += 0.02
}


export default { init, draw }
