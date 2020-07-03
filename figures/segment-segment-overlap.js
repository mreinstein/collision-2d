import common                from './common.js'
import contact               from '../src/contact.js'
import segmentSegmentOverlap from '../src/segment-segment-overlap.js'
//import segmentSegmentOverlap from '../src/lines-intersect.js'
import { vec2 }              from '../src/deps.js'


function init (context, width, height) {
    return {
        angle: 2.6,
        line: [
            [ 50, 0 ],
            [ 0, 50 ]
        ],
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
   
    const intersection = [ 0, 0 ]
    const hit = segmentSegmentOverlap(pos1, pos2, data.line[0], data.line[1], intersection)

    common.drawSegment(data, data.line[0], data.line[1], '#666')
    common.drawSegment(data, pos1, pos2, '#666')

    if (hit > 0 )
        common.drawPoint(data, intersection, '#ff0')
}


export default { init, draw }
