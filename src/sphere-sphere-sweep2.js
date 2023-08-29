import { vec2 } from './deps.js'


// from https://web.archive.org/web/20100629145557/http://www.gamasutra.com/view/feature/3383/simple_intersection_tests_for_games.php?page=2

// tmp vars to avoid garbage collection
const va = vec2.create()
const vb = vec2.create()
const AB = vec2.create()
const vab = vec2.create()

const _roots = { r1: NaN, r2: NaN }


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
        _roots.r1 = 0
        _roots.r2 = 0

        fillContactDeets(ra, A0, A1, rb, B0, B1, _roots, contact) 
        return true
    }

    // check if they hit each other during the frame
    if (QuadraticFormula(a, b, c, _roots)) {

        if (_roots.r1 > _roots.r2) {
            const tmp = _roots.r1
            _roots.r1 = _roots.r2
            _roots.r2 = tmp
        }

        // if r1 is greater than 1, that means the collision happened outside of the 
        // t = [0..1] range that we're looking for (will interesect at a future time)
        if (_roots.r1 <= 1) {
           fillContactDeets(ra, A0, A1, rb, B0, B1, _roots, contact)
            return true 
        }
    }

    return false
}


const _delta = vec2.create()
const _pos1 = vec2.create()
const _pos2 = vec2.create()

function fillContactDeets (ra, A0, A1, rb, B0, B1, roots, contact) {
    contact.time = roots.r1

    // final sphereA position
    vec2.subtract(_delta, A1, A0)
    vec2.scaleAndAdd(_pos1, A0, _delta, contact.time)

    // final sphereB position
    vec2.subtract(_delta, B1, B0)
    vec2.scaleAndAdd(_pos2, B0, _delta, contact.time)

    vec2.subtract(contact.position, _pos1, _pos2)
    vec2.normalize(contact.position, contact.position)
    vec2.scaleAndAdd(contact.position, _pos2, contact.position, rb)

    vec2.subtract(contact.normal, _pos1, contact.position)
    vec2.normalize(contact.normal, contact.normal)
}


// Return true if r1 and r2 are real
// out.r1    first
// out.r2    and second roots
function QuadraticFormula (a, b, c, out) {
 
    const q = b*b - 4*a*c

    if ( q >= 0) {
        const sq = Math.sqrt(q)
        const d = 1 / (2*a)
        out.r1 = ( -b + sq ) * d
        out.r2 = ( -b - sq ) * d
        return true   // real roots
    } else {
        return false  // complex roots
    }
}
