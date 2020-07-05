import common               from './common.js'
import contact              from '../src/contact.js'
import segmentsSphereSweep1 from '../src/segments-sphere-sweep1.js'
import { vec2 }             from '../src/deps.js'



function randomInt (min, max) {
    const d = max - min
    return min + Math.floor(d * Math.random())
}



function init (context, width, height) {
    
    //const lines = [[[4,23],[6,31]],[[-22,-15],[96,28]],[[-67,76],[5,-77]],[[-26,-23],[-69,-37]],[[-11,59],[12,38]]]
    
    const lines = [ ]

    for (let i =0; i < 5; i++) {
        const p0 = [ randomInt(-100, 100), randomInt(-100, 100) ]
        const p1 = [ randomInt(-100, 100), randomInt(-100, 100) ]
        lines.push([ p0, p1 ]) 
    }

    console.log('lines:', JSON.stringify(lines))
    

    return {
        angle: 2.6,
        prevPos: [ 0, 0 ],
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

    const radius = 10

    //const delta = vec2.subtract([], pos2, pos1)
    const delta = vec2.subtract([], pos1, data.prevPos)

    for (const line of data.lines)
        common.drawSegment(data, line[0], line[1], '#666')

    const c = contact()

    if (segmentsSphereSweep1(data.lines, pos1, radius, delta, c)) {
        console.log('contact normal:', c.normal)
        //common.drawSegment(data, pos1, c.position, '#ff0')
        //common.drawSegment(data, pos1, pos2, '#f00')
        common.drawPoint(data, c.position, '#ff0', '', 2)
        common.drawCircle(data, pos1, radius, '#ff0')
    } else {
        //common.drawSegment(data, pos1, pos2, '#0f0')
        common.drawCircle(data, pos1, radius, '#0f0')
    }

    vec2.copy(data.prevPos, pos1)
   
}


export default { init, draw }
