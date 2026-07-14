import { vec2 } from 'wgpu-matrix'


// convert an oriented bounding box into its 4 corner points, wound
// counter-clockwise. writes into the provided array of 4 vec2s.
//
// @param Object obb   { position:[x,y], width, height, rotation } rotation in radians
// @param Array out    array of 4 vec2 to fill with the world-space corners
export default function obbToPoints (obb, out) {
    const c = Math.cos(obb.rotation)
    const s = Math.sin(obb.rotation)
    const hw = obb.width / 2
    const hh = obb.height / 2
    const px = obb.position[0]
    const py = obb.position[1]

    // local corners rotated into world space: [ x*cos - y*sin, x*sin + y*cos ] + center
    vec2.set(px - hw * c + hh * s, py - hw * s - hh * c, out[0])  // (-hw, -hh)
    vec2.set(px + hw * c + hh * s, py + hw * s - hh * c, out[1])  // ( hw, -hh)
    vec2.set(px + hw * c - hh * s, py + hw * s + hh * c, out[2])  // ( hw,  hh)
    vec2.set(px - hw * c - hh * s, py - hw * s + hh * c, out[3])  // (-hw,  hh)

    return out
}
