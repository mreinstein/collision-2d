import clamp         from 'clamp'
import intersectAABB from './aabb-aabb-overlap.js'
import intersectLine from './aabb-segment-overlap.js'
import { vec2 }      from 'gl-matrix'


const EPSILON = 1e-8

/*
finds the intersection of this box and another moving box, where the delta
argument is the displacement vector of the moving box
https://noonat.github.io/intersect/#aabb-vs-swept-aabb

@param aabb the static box
@param aabb2 the moving box
@param delta the displacement vector of aabb2
@param contact the contact object. filled if collision occurs
@return bool true if the two AABBs collide, false otherwise
*/
export default function aabbAABBSweep1 (aabb, aabb2, delta, contact) {
    if (delta[0] === 0 && delta[1] === 0)
        return intersectAABB(aabb, aabb2, contact)

    const result = intersectLine(aabb, aabb2.position, delta, aabb2.width/2, aabb2.height/2, contact)
    if (result) {
        contact.time = clamp(contact.time - EPSILON, 0, 1)

        //contact.position[0] = aabb2.position[0] + delta[0] * contact.time
        //contact.position[1] = aabb2.position[1] + delta[1] * contact.time

        const direction = vec2.normalize([], delta)
      
        const halfX2 = aabb2.width / 2
        const halfY2 = aabb2.height / 2

        const halfX = aabb.width / 2
        const halfY = aabb.height / 2

        contact.position[0] = clamp(contact.position[0] + direction[0] * halfX2, aabb.position[0] - halfX, aabb.position[0] + halfX);
        contact.position[1] = clamp(contact.position[1] + direction[1] * halfY2, aabb.position[1] - halfY, aabb.position[1] + halfY);
    }

  return result
}
