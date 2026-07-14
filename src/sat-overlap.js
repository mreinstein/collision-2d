import { vec2 } from 'wgpu-matrix'


// static temp variables to avoid creating new ones each invocation
const _ca = vec2.create()
const _cb = vec2.create()
const _pa = { min: 0, max: 0 }
const _pb = { min: 0, max: 0 }


// project all points of a convex polygon onto a (normalized) axis,
// writing the min/max scalar extent into out
function project (points, ax, ay, out) {
    let min = points[0][0] * ax + points[0][1] * ay
    let max = min

    for (let i = 1; i < points.length; i++) {
        const d = points[i][0] * ax + points[i][1] * ay
        if (d < min) min = d
        if (d > max) max = d
    }

    out.min = min
    out.max = max
}


function centroid (points, out) {
    let x = 0, y = 0
    for (const p of points) {
        x += p[0]
        y += p[1]
    }
    vec2.set(x / points.length, y / points.length, out)
    return out
}


/*
Separating Axis Theorem (SAT) overlap test between two convex polygons.

https://dyn4j.org/2010/01/sat/

Each polygon is an array of vec2 points (any consistent winding). The test
projects both shapes onto every edge normal; a gap on any axis means no
collision. When they do overlap, the axis of least penetration gives the
minimum translation vector (MTV) used for contact resolution.

@param Array polyA        first convex polygon (array of vec2)
@param Array polyB        second convex polygon (array of vec2)
@param Object contact     if specified, filled with collision details
@param any colliderRef    stored on contact.collider (defaults to polyA)
@returns bool true if the polygons overlap, false otherwise
*/
export default function satOverlap (polyA, polyB, contact = null, colliderRef = null) {
    let minOverlap = Infinity
    let axisX = 0
    let axisY = 0

    // test the edge normals of both polygons as candidate separating axes
    for (let s = 0; s < 2; s++) {
        const poly = s === 0 ? polyA : polyB

        for (let i = 0; i < poly.length; i++) {
            const p1 = poly[i]
            const p2 = poly[(i + 1) % poly.length]

            // outward normal of this edge: [ -dy, dx ]
            let nx = -(p2[1] - p1[1])
            let ny = p2[0] - p1[0]
            const len = Math.hypot(nx, ny)
            if (len === 0)
                continue
            nx /= len
            ny /= len

            project(polyA, nx, ny, _pa)
            project(polyB, nx, ny, _pb)

            const overlap = Math.min(_pa.max, _pb.max) - Math.max(_pa.min, _pb.min)

            // a gap (or flush contact) on any axis means the shapes are separated
            if (overlap <= 0)
                return false

            if (overlap < minOverlap) {
                minOverlap = overlap
                axisX = nx
                axisY = ny
            }
        }
    }

    if (!contact)
        return true

    centroid(polyA, _ca)
    centroid(polyB, _cb)

    // orient the MTV axis from A toward B so delta pushes B out of A
    if ((_cb[0] - _ca[0]) * axisX + (_cb[1] - _ca[1]) * axisY < 0) {
        axisX = -axisX
        axisY = -axisY
    }

    contact.collider = colliderRef !== null ? colliderRef : polyA
    contact.time = 0

    // normal points from A toward B; delta is the MTV to move B into a non-colliding state
    vec2.set(axisX, axisY, contact.normal)
    vec2.set(axisX * minOverlap, axisY * minOverlap, contact.delta)

    // estimate the contact point: midpoint of the overlapping interval along the
    // MTV axis, projected onto the line through A's centroid
    project(polyA, axisX, axisY, _pa)
    project(polyB, axisX, axisY, _pb)
    const mid = (Math.max(_pa.min, _pb.min) + Math.min(_pa.max, _pb.max)) / 2
    const caProj = _ca[0] * axisX + _ca[1] * axisY
    vec2.set(_ca[0] + axisX * (mid - caProj), _ca[1] + axisY * (mid - caProj), contact.position)

    return true
}
