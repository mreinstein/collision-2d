
function vec2GetAngle (vec2) {
  return Math.atan2(vec2[1], vec2[0])
}


export default function setLength (out, vec2, length) {
    const a = vec2GetAngle(vec2)
    out[0] = Math.cos(a) * length
    out[1] = Math.sin(a) * length
    return out
}
