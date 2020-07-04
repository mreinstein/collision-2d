import common                from './common.js'
import contact               from '../src/contact.js'
import segmentsSegmentOverlap from '../src/segments-segment-overlap.js'
import { vec2 }              from '../src/deps.js'


/*
function randomInt (min, max) {
    const d = max - min
    return min + Math.floor(d * Math.random())
}
*/


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
   
    

    for (const line of data.lines)
        common.drawSegment(data, line[0], line[1], '#666')

    const c = contact()

    if (segmentsSegmentOverlap(data.lines, pos1, delta, c)) {
        common.drawSegment(data, pos1, c.position, '#ff0')
        common.drawSegment(data, pos2, c.position, '#f00')
        common.drawPoint(data, c.position, '#ff0', '', 2)
    } else {
        //console.log('no hit')
        common.drawSegment(data, pos1, pos2, '#0f0')
    }
   
}


export default { init, draw }
