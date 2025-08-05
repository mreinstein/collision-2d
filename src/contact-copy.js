import { vec2 } from 'wgpu-matrix'


export default function copyContact (out, contact) {
    out.time = contact.time
    out.collider = contact.collider
    vec2.copy(contact.position, out.position)
    vec2.copy(contact.delta, out.delta)
    vec2.copy(contact.normal, out.normal)
    return out
}
