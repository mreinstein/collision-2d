import * as vec2 from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.3.0/esm/vec2.js'


export default function lineSegmentNormal (out, pos1, pos2) {
    let dx = pos2[0] - pos1[0]
    let dy = pos2[1] - pos1[1]

    if (dx !== 0)
        dx = -dx

    vec2.set(out, dy, dx)  // normals: [ -dy, dx ]  [ dy, -dx ]
    vec2.normalize(out, out)
}
