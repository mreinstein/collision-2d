import { vec2 } from 'gl-matrix'


export default function copyContact (out, contact) {
    out.time = contact.time
    out.collider = contact.collider
    vec2.copy(out.position, contact.position)
    vec2.copy(out.delta, contact.delta)
    vec2.copy(out.normal, contact.normal)
    return out
}
