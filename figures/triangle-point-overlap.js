import common          from './common.js'
import triPointOverlap from '../src/triangle-point-overlap.js'


function init (context, width, height) {
    return {
        angle: 0,
        pos: [ 0, 0 ],
        tri: [
            [ 0, -20 ],
            [ -20, 20 ],
            [ 20, 20 ]
        ],
        ...common.init(context, width, height)
    }
}


function draw (data, dt) {
    common.clear(data)

    data.angle += 0.5 * Math.PI * dt
    data.pos[0] = Math.cos(data.angle * 0.4) * 32
    data.pos[1] = Math.sin(data.angle) * 12
    
    const overlapping = triPointOverlap(data.tri[0], data.tri[1], data.tri[2], data.pos)

    common.drawTriangle(data, data.tri[0], data.tri[1], data.tri[2], '#666')

    const pointWidth = 1

    if (overlapping)
      common.drawPoint(data, data.pos, '#f00', '', pointWidth)
    else
      common.drawPoint(data, data.pos, '#0f0', '', pointWidth)
}


export default { init, draw }
