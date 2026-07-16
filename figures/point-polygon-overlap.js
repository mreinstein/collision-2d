import common             from './common.js'
import pointPolygonOverlap from '../src/point-polygon-overlap.js'
import { vec2 }            from 'wgpu-matrix'


// build closed-loop segments from a vertex list
function polygonSegments (verts) {
    const segments = []
    for (let i = 0; i < verts.length; i++)
        segments.push([ verts[i], verts[(i + 1) % verts.length] ])

    return segments
}


function init (context, width, height) {
    // convex hexagon centered at local origin (screen y-down)
    const r = 30
    const hexagon = []
    for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3
        hexagon.push([ Math.cos(a) * r, -Math.sin(a) * r ])
    }

    // concave arrowhead with a reflex notch at the bottom
    const arrow = [
        [   0, -32 ],   // tip
        [  28,  28 ],   // right barb
        [   0,   8 ],   // notch (reflex vertex -> concave)
        [ -28,  28 ]    // left barb
    ]

    return {
        angle: 0,
        pos: [ 0, 0 ],
        convex: polygonSegments(hexagon),
        concave: polygonSegments(arrow),
        convexOffset: vec2.fromValues(-45, 0),
        concaveOffset: vec2.fromValues(45, 0),
        ...common.init(context, width, height)
    }
}


function drawPolygon (data, segments, offset, color) {
    for (const seg of segments) {
        const a = [ seg[0][0] + offset[0], seg[0][1] + offset[1] ]
        const b = [ seg[1][0] + offset[0], seg[1][1] + offset[1] ]
        common.drawSegment(data, a, b, color)
    }
}


function draw (data, dt) {
    common.clear(data)

    data.angle += 1.0 * Math.PI * dt
    data.pos[0] = Math.sin(data.angle * 0.5) * 90
    data.pos[1] = Math.sin(data.angle * 1.7) * 28

    drawPolygon(data, data.convex, data.convexOffset, '#666')
    drawPolygon(data, data.concave, data.concaveOffset, '#666')

    const inConvex  = pointPolygonOverlap(data.pos, data.convex, data.convexOffset)
    const inConcave = pointPolygonOverlap(data.pos, data.concave, data.concaveOffset)

    common.drawPoint(data, data.pos, (inConvex || inConcave) ? '#f00' : '#0f0', '', 2)
}


export default { init, draw }
