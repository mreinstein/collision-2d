import Contact from '../src/contact.js'
import assert  from './_assert.js'
import sweep   from '../src/segments-ellipsoid-sweep1-indexed.js'
import { vec2 } from 'gl-matrix'


const lines = [
	[ [64.0, 128.0], [ 64.0, 0.0 ] ],
	[ [0,0], [0, 128] ]
]
const indices = [ 0, 1 ]
    
const ellipsoid = [ 5, 10 ]
const position = [ 32, 64 ]
const delta = [ 120, 0 ]
const lineCount = 2
const contact = Contact()

 
// convert the start and end positions into R3 ellipsoid space
vec2.divide(position, position, ellipsoid)
vec2.divide(delta, delta, ellipsoid)

const collision = sweep(lines, indices, lineCount, position, ellipsoid, delta, contact)

// convert the intersection point back to R3 (non-ellipsoid) space
vec2.multiply(contact.position, contact.position, ellipsoid)

assert.equal(collision, true)
assert.equal(contact.collider, 0)
assert.almostEqual(contact.time, 0.225)

const EPSILON = 0.000001
assert.almostEqual(contact.position[0], 64, EPSILON)
assert.almostEqual(contact.position[1], 64, EPSILON)

assert.deepEqual(contact.normal, [ -1, 0 ])
