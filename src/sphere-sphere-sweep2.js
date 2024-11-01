import getLowestRoot from './get-lowest-root.js'
import { vec2 }      from 'gl-matrix'


// from https://web.archive.org/web/20100629145557/http://www.gamasutra.com/view/feature/3383/simple_intersection_tests_for_games.php?page=2

// tmp vars to avoid garbage collection
const va = vec2.create()
const vb = vec2.create()
const AB = vec2.create()
const vab = vec2.create()


/*
const SCALAR ra, //radius of sphere A
const VECTOR& A0, //previous position of sphere A
const VECTOR& A1, //current position of sphere A
const SCALAR rb, //radius of sphere B
const VECTOR& B0, //previous position of sphere B
const VECTOR& B1, //current position of sphere B
SCALAR& u0, //normalized time of first collision
SCALAR& u1 //normalized time of second collision
*/
export default function sphereSphereSweep2 (ra, A0, A1, rb, B0, B1, contact) {
 
    vec2.subtract(va, A1, A0)
    
    vec2.subtract(vb, B1, B0)

    vec2.subtract(AB, B0, A0)

    vec2.subtract(vab, vb, va)     // relative velocity (in normalized time)


    const rab = ra + rb

    const a = vec2.dot(vab, vab)         // u*u coefficient
    

    const b = 2 * vec2.dot(vab, AB)      // u coefficient

    const c = vec2.dot(AB, AB) - rab*rab // constant term

    // check if they're currently overlapping
    if (vec2.dot(AB, AB) <= rab*rab) {
        const t = 0
        fillContactDeets(ra, A0, A1, rb, B0, B1, t, contact) 
        return true
    }

    // check if they hit each other during the frame
    const maxVal = 1
    const t = getLowestRoot(a, b, c, maxVal)

    if (t !== null) {
        fillContactDeets(ra, A0, A1, rb, B0, B1, t, contact)
        return true
    }

    return false
}


const _delta = vec2.create()
const _pos1 = vec2.create()
const _pos2 = vec2.create()

function fillContactDeets (ra, A0, A1, rb, B0, B1, t, contact) {
    contact.time = t

    // final sphereA position
    vec2.subtract(_delta, A1, A0)
    vec2.scaleAndAdd(_pos1, A0, _delta, contact.time)

    // final sphereB position
    vec2.subtract(_delta, B1, B0)
    vec2.scaleAndAdd(_pos2, B0, _delta, contact.time)

    vec2.subtract(contact.position, _pos1, _pos2)
    vec2.normalize(contact.position, contact.position)
    vec2.scaleAndAdd(contact.position, _pos2, contact.position, rb)

    vec2.subtract(contact.normal, contact.position, _pos2)
    vec2.normalize(contact.normal, contact.normal)
}

