import { clamp }     from './deps.js'
import intersectAABB from './aabb-aabb-overlap.js'
import intersectLine from './aabb-segment-overlap.js'


const EPSILON = 1e-8

/*
finds the intersection of this box and another moving box, where the delta
argument is the displacement vector of the moving box
http://noonat.github.io/intersect/#aabb-vs-swept-aabb

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
  if (result)
    contact.time = clamp(contact.time - EPSILON, 0, 1)

  return result
}
