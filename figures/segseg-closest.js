import common       from './common.js'
import segSegClosest from '../src/segseg-closest.js'


function init (context, width, height) {
    return {
        angle: 0,
        // static segment S1
        s1: [
            [ -120, -30 ],
            [ -20, 40 ]
        ],
        ...common.init(context, width, height)
    }
}


function draw (data, dt) {
    common.clear(data)

    data.angle += 0.3 * Math.PI * dt

    // moving segment S2 orbits + spins on the right side
    const cx = 60 + Math.cos(data.angle) * 20
    const cy = Math.sin(data.angle * 1.7) * 40
    const a  = data.angle * 1.3
    const len = 50
    const s2 = [
        [ cx - Math.cos(a) * len, cy - Math.sin(a) * len ],
        [ cx + Math.cos(a) * len, cy + Math.sin(a) * len ]
    ]

    const detail = { sc: 0, tc: 0, closestDistance: 0 }
    segSegClosest(data.s1, s2, detail)

    // closest point on each segment from the returned parameters
    const p1 = [
        data.s1[0][0] + detail.sc * (data.s1[1][0] - data.s1[0][0]),
        data.s1[0][1] + detail.sc * (data.s1[1][1] - data.s1[0][1])
    ]
    const p2 = [
        s2[0][0] + detail.tc * (s2[1][0] - s2[0][0]),
        s2[0][1] + detail.tc * (s2[1][1] - s2[0][1])
    ]

    common.drawSegment(data, data.s1[0], data.s1[1], '#666')
    common.drawSegment(data, s2[0], s2[1], '#666')

    // shortest connecting segment between the two closest points
    common.drawSegment(data, p1, p2, '#ff0', 1, true)
    common.drawPoint(data, p1, '#0f0', '', 2)
    common.drawPoint(data, p2, '#f00', '', 2)
}


export default { init, draw }
