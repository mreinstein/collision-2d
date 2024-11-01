import { vec2 } from 'gl-matrix'


export default function segmentNormal (out, pos1, pos2) {
    let dx = pos2[0] - pos1[0]
    let dy = pos2[1] - pos1[1]

    if (dx !== 0)
        dx = -dx

    vec2.set(out, dy, dx)  // normals: [ -dy, dx ]  [ dy, -dx ]
    vec2.normalize(out, out)

    return out
}
