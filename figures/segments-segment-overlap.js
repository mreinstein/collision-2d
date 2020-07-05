import common                 from './common.js'
import contact                from '../src/contact.js'
import segmentsSegmentOverlap from '../src/segments-segment-overlap.js'
import { vec2 }               from '../src/deps.js'
//import randomInt              from 'https://cdn.jsdelivr.net/gh/mreinstein/random-gap@master/int.js'


function init (context, width, height) {
    /*
    const lines = [
        [[-22,-86],[-88,-72]],
        [[40,-40],[59,-13]],
        [[70,-91],[40,-95]],

        [[-23,-79],[-21,93]],
        [[-6,-97],[29,96]]
    ]
    */

    const lines = [[[4,23],[6,31]],[[-22,-15],[96,28]],[[-67,76],[5,-77]],[[-26,-23],[-69,-37]],[[-11,59],[12,38]]]

    //const lines = [[[86,-97],[-10,46]],[[20,24],[-62,-58]],[[16,56],[-19,53]],[[73,-3],[-74,-85]],[[75,86],[-3,-100]]]
    
    //const lines = [[[-36,91],[-4,-6]],[[-75,37],[21,-84]],[[24,56],[-8,-3]],[[-4,61],[77,-62]],[[17,3],[-80,-36]]]
    
    
    /*
    const lines = [ ]

    for (let i =0; i < 5; i++) {
        const p0 = [ randomInt(-100, 100), randomInt(-100, 100) ]
        const p1 = [ randomInt(-100, 100), randomInt(-100, 100) ]
        lines.push([ p0, p1 ]) 
    }

    console.log('lines:', JSON.stringify(lines))
    */

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
