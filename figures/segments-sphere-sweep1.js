import common               from './common.js'
import contact              from '../src/contact.js'
import segmentsSphereSweep1 from '../src/segments-sphere-sweep1.js'
import { vec2 }             from 'gl-matrix'
import randomInt            from 'https://cdn.jsdelivr.net/gh/mreinstein/random-gap/int.js'


function init (context, width, height) {
    
    const lines = [
        [ [-50, -50], [ -50, 50] ],
        [ [ 50, 50], [ 50, -50] ],
        //[ [ 50, -50 ], [ -50, -50 ] ],
        //[ [ -50, 50 ], [ 50, 50 ] ]
    ]

    const velocity = vec2.random([], 60)

    return {
        angle: 2.6,
        radius: 10,
        position: [ 0, 0 ],
        velocity: [ 80, 0],
        dx: 80,
        lines,
        ...common.init(context, width, height)
    }
}


function draw (data, dt) {
    common.clear(data)
   
    const delta = vec2.scale([], data.velocity, dt)

    for (const line of data.lines)
        common.drawSegment(data, line[0], line[1], '#666')

    const c = contact()

    if (segmentsSphereSweep1(data.lines, data.position, data.radius, delta, c)) {
        common.drawCircle(data, data.position, data.radius, '#ff0')
        common.drawPoint(data, c.position, '#ff0', '', 2)

        // bounce
        vec2.scale(data.velocity, c.normal, data.dx)
     
    } else {
        vec2.add(data.position, data.position, delta)
        common.drawCircle(data, data.position, data.radius, '#0f0')
    }
   
}


export default { init, draw }
