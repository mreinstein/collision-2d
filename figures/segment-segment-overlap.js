import common                from './common.js'
import segmentSegmentOverlap from '../src/segment-segment-overlap.js'
import { vec2 }              from 'gl-matrix'


function init (context, width, height) {
    return {
        angle: 2.6,
        line: [
            [ 50, -50 ],
            [ -50, 50 ]
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

    common.drawSegment(data, data.line[0], data.line[1], '#666')
    

    const intersection = [ 0, 0 ]
    if (segmentSegmentOverlap(pos1, pos2, data.line[0], data.line[1], intersection)) {
        common.drawPoint(data, intersection, '#ff0', '', 2)
        common.drawSegment(data, pos1, intersection, '#ff0')
        common.drawSegment(data, pos2, intersection, '#f00')
    }
    else {
        common.drawSegment(data, pos1, pos2, '#0f0')
    }

}


export default { init, draw }
