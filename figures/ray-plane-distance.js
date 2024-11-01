import common          from './common.js'
import plane           from '../src/plane.js'
import { vec2 }        from 'gl-matrix'
import segmentNormal   from '../src/segment-normal.js'
import setLength       from 'https://cdn.jsdelivr.net/gh/mreinstein/vec2-gap/set-length.js'


function init (context, width, height) {
    const line = [
        [ -200, 200 ],
        [ 200, -200 ]
    ]

    const planeNormal = segmentNormal([], line[0], line[1])
    const planeOrigin = line[0]

    return {
        angle: 2.6,
        line,
        planeNormal,
        planeOrigin,
        ...common.init(context, width, height)
    }
}



function draw (data, dt) {
    common.clear(data)

    //window.d = data
    data.angle += 0.5 * Math.PI * dt
    //data.angle = 6.8

    const pos1 = [
        Math.cos(data.angle) * 64,
        Math.sin(data.angle) * 64
    ]

    const pos2 = [
        Math.sin(data.angle) * 32,
        Math.cos(data.angle) * 32
    ]

    const delta = vec2.subtract([], pos2, pos1)

    common.drawSegment(data, data.line[0], data.line[1], '#666', 1, true)
    
    const dir = vec2.normalize([], delta)

    const p = plane.create()
    plane.fromPlane(p, data.planeOrigin, data.planeNormal)

    const distance = plane.rayDistance(p, pos1, dir)


    //const len = vec2.length(delta)
    //common.drawRay(data, pos1, dir, len, '#0f0')

    //const rr = setLength([], dir, distance)
    common.drawRay(data, pos1, dir, distance, '#ff0')

    /*
    if (segmentSegmentOverlap(pos1, pos2, data.line[0], data.line[1], intersection)) {
        common.drawPoint(data, intersection, '#ff0', '', 2)
        common.drawSegment(data, pos1, intersection, '#ff0')
        common.drawSegment(data, pos2, intersection, '#f00')
    }
    else {
        common.drawSegment(data, pos1, pos2, '#0f0')
    }
    */

}


export default { init, draw }
