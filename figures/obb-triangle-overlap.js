import common        from './common.js'
import contact        from '../src/contact.js'
import obbTriOverlap  from '../src/obb-triangle-overlap.js'


function init (context, width, height) {
    return {
        angle: 0,
        // base (unrotated) triangle points
        tri: [
            [ 0, -40 ],
            [ -44, 36 ],
            [ 44, 36 ]
        ],
        // centroid the triangle spins about
        center: [ 0, 32 / 3 ],
        // scratch array holding the spun triangle each frame
        triR: [ [ 0, 0 ], [ 0, 0 ], [ 0, 0 ] ],
        box: {
            position: [ 0, 0 ],
            width: 48,
            height: 28,
            rotation: 0
        },
        ...common.init(context, width, height)
    }
}


function draw (data, dt) {
    common.clear(data)

    data.angle += 0.4 * Math.PI * dt
    data.box.position[0] = Math.cos(data.angle * 0.7) * 80
    data.box.position[1] = Math.sin(data.angle) * 40
    data.box.rotation = data.angle

    // spin the triangle about its centroid
    const tc = Math.cos(data.angle * 0.5)
    const ts = Math.sin(data.angle * 0.5)
    for (let i = 0; i < 3; i++) {
        const dx = data.tri[i][0] - data.center[0]
        const dy = data.tri[i][1] - data.center[1]
        data.triR[i][0] = data.center[0] + dx * tc - dy * ts
        data.triR[i][1] = data.center[1] + dx * ts + dy * tc
    }


    const c = contact()
    const hit = obbTriOverlap(data.box, data.triR[0], data.triR[1], data.triR[2], c)

    common.drawTriangle(data, data.triR[0], data.triR[1], data.triR[2], '#666')

    if (hit) {
      common.drawOBB(data, data.box, '#f00')
      // delta moves the triangle out; equivalently push the box out by -delta
      data.box.position[0] -= c.delta[0]
      data.box.position[1] -= c.delta[1]
      common.drawOBB(data, data.box, '#ff0')
      common.drawPoint(data, c.position, '#ff0')
      common.drawRay(data, c.position, c.normal, 4, '#ff0', false)
    } else {
      common.drawOBB(data, data.box, '#0f0')
    }
}


export default { init, draw }
