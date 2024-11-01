import common                 from './common.js'
import contact                from '../src/contact.js'
import segmentsSegmentOverlap from '../src/segments-segment-overlap.js'
import { vec2 }               from 'gl-matrix'


function init (context, width, height) {
    
    const lines = [[[4,23],[6,31]],[[-22,-15],[96,28]],[[-67,76],[5,-77]],[[-26,-23],[-69,-37]],[[-11,59],[12,38]]]

    return {
        angle: 2.6,
        lines,
        ...common.init(context, width, height)
    }
}


function draw (data, dt) {
    common.clear(data)

    data.angle += 0.4 * Math.PI * dt


    const pos1 = [
        Math.cos(data.angle) * 64,
        Math.sin(data.angle) * 64
    ]

    const pos2 = [
        Math.sin(data.angle) * 32,
        Math.cos(data.angle) * 32
    ]

    const delta = vec2.subtract([], pos2, pos1)
    let len = vec2.length(delta)
    const dir = vec2.normalize([], delta)
    

    for (const line of data.lines)
        common.drawSegment(data, line[0], line[1], '#666')

    const c = contact()

    if (segmentsSegmentOverlap(data.lines, pos1, delta, c)) {
        vec2.subtract(dir, c.position, pos1)
        len = vec2.length(dir)
        vec2.normalize(dir, dir)
        common.drawRay(data, pos1, dir, len, '#ff0')

        vec2.subtract(dir, pos2, c.position)
        len = vec2.length(dir)
        vec2.normalize(dir, dir)
        common.drawRay(data, c.position, dir, len, '#f00')
        
        common.drawPoint(data, c.position, '#ff0', '', 2)
    } else {
        common.drawRay(data, pos1, dir, len, '#0f0')
    }
   
}


export default { init, draw }
