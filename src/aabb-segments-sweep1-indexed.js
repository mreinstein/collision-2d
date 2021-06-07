// based on https://gamedev.stackexchange.com/questions/29479/swept-aabb-vs-line-segment-2d
import aabbSegmentSweep1 from './aabb-segment-sweep1.js'
import contact           from './contact.js'
import { vec2 }          from './deps.js'


const _tmpContact = contact()


function copyContact (out, contact) {
    out.time = contact.time
    out.collider = contact.collider
    vec2.copy(out.position, contact.position)
    vec2.copy(out.delta, contact.delta)
    vec2.copy(out.normal, contact.normal)
    return out
}


export default function aabbSegmentSweep1Indexed (lines, indices, lineCount, aabb, delta, contact) {
    
    let colliderIndex = -1
    let resHitTime

    for (let i=0; i<lineCount; i++) {
        const idx = indices[i]
        const line = lines[idx]

        if (aabbSegmentSweep1(line, aabb, delta, _tmpContact)) {
            // keep the first one encountered along the sweep's trajectory
            if (colliderIndex === -1 || _tmpContact.time < resHitTime) {
                colliderIndex = idx
                resHitTime = _tmpContact.time
                copyContact(contact, _tmpContact)
                contact.collider = idx
            }
        }
    }

    return colliderIndex >= 0
}
