import common    from './common.js'
import contact   from '../src/contact.js'
import segmentPointOverlap from '../src/segment-point-overlap.js'
import { vec2 }   from 'gl-matrix'


function init (context, width, height) {
    return {
        angle: 0,
        line: [
            [ 50, -50],
            [ -50, 50 ]
        ],
        point: [ 0, 0 ],
        ...common.init(context, width, height)
    }
}


function draw (data, dt) {
    common.clear(data)

    data.angle += 0.5 * Math.PI * dt
    vec2.set(data.point,  Math.cos(data.angle * 0.4) * 32, Math.sin(data.angle) * 12)
  
    common.drawSegment(data, data.line[0], data.line[1], '#666')

    const overlaps = segmentPointOverlap(data.point, data.line[0], data.line[1])

    common.drawPoint(data, data.point, overlaps ? '#ff0' : '#0f0', '', 2)
}


export default { init, draw }
