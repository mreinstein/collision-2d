//import TraceInfo  from '../src/TraceInfo.js'
import assert     from './_assert.js'
import toji       from '../src/toji-tris.js'



//assert.equal(aabbSegOverlap(aabb, seg[0], delta, paddingX, paddingY), false)

const start = [ 0, 32 ]
const end = [ 128, 32 ]
const radius = 16

const ti = new toji.TraceInfo()
ti.resetTrace(start, end, radius)

const b = [ 128, 0 ]
const a = [ 128, 128 ]

toji.traceSphereTriangle(a, b, ti);

assert.equal(ti.collision, true)
assert.equal(ti.t, 0.875)
assert.deepEqual(ti.intersectTriNorm, [ -1, 0 ])
assert.deepEqual(ti.intersectPoint, [ 128, 32 ])
