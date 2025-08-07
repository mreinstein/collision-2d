import assert         from './_assert.js'
import aabbSegOverlap from '../src/aabb-segment-overlap.js'
import contact        from '../src/contact.js'
import { vec2 }       from 'wgpu-matrix'


const aabb = {
	position: [ 2624.20556640625, 1062 ],
	width: 10,
	height: 24
}

const seg = [
	[3152, 1072],
	[3248, 1072]
]

const delta = [ 96, 0 ]


{
	let paddingX = 0
	let paddingY = -2

	assert.equal(aabbSegOverlap(aabb, seg[0], delta, paddingX, paddingY), false)
}


{
	aabb.position = [ 907.5, 318.5 ]
	aabb.width = 15
	aabb.height = 35


	seg[0] = [ 531, 301 ]
	delta[0] = 16

	assert.equal(aabbSegOverlap(aabb, seg[0], delta), false)
}

const hit = contact()


// should return false when not colliding
{
	vec2.set(0, 0, aabb.position)
	aabb.width = aabb.height = 16
	assert.equal(aabbSegOverlap(aabb, [ -16, -16 ], [ 32, 0 ], 0, 0), false)
}

// should return hit when colliding
{
	const point = [ -16, 4 ]
	const delta = [ 32, 0 ]
	assert.equal(aabbSegOverlap(aabb, point, delta, 0, 0, hit), true)

	const time = 0.25
	assert.equal(hit.collider, aabb)
	assert.almostEqual(hit.time, time)
	assert.almostEqual(hit.position[0], point[0] + delta[0] * time)
	assert.almostEqual(hit.position[1], point[1] + delta[1] * time)
	assert.almostEqual(hit.delta[0], (1.0 - time) * -delta[0])
	assert.almostEqual(hit.delta[1], (1.0 - time) * -delta[1])
	assert.almostEqual(hit.normal[0], -1)
	assert.almostEqual(hit.normal[1], 0)
}

// should set hit.time to zero when segment starts inside box
{
  const point = [ -4, 4 ]
  const delta = [ 32, 0 ]
  assert.equal(aabbSegOverlap(aabb, point, delta, 0, 0, hit), true)
  assert.almostEqual(hit.time, 0);
  assert.almostEqual(hit.position[0], -4)
  assert.almostEqual(hit.position[1], 4)
  assert.almostEqual(hit.delta[0], -delta[0])
  assert.almostEqual(hit.delta[1], -delta[1])
  assert.almostEqual(hit.normal[0], -1)
  assert.almostEqual(hit.normal[1], 0)
}

// should add padding to half size of box
{
  const point = [ -16, 4 ]
  const delta = [ 32, 0 ]
  const padding = 4
  assert.equal(aabbSegOverlap(aabb, point, delta, padding, padding, hit), true)

  const time = 0.125
  assert.equal(hit.collider, aabb)
  assert.almostEqual(hit.time, time)
  assert.almostEqual(hit.position[0], point[0] + delta[0] * time)
  assert.almostEqual(hit.position[1], point[1] + delta[1] * time)
  assert.almostEqual(hit.delta[0], (1.0 - time) * -delta[0])
  assert.almostEqual(hit.delta[1], (1.0 - time) * -delta[1])
  assert.almostEqual(hit.normal[0], -1)
  assert.almostEqual(hit.normal[1], 0)
}

// should have consistent results in both directions
{
  // If moving from far away to the near edge of the box doesn't cause a
  // collision, then moving away from the near edge shouldn't either.
  aabb.width = aabb.height = 64

  const farPos = [ 64, 0 ]
  const farToNearDelta = [ -32, 0 ]
  assert.equal(aabbSegOverlap(aabb, farPos, farToNearDelta), false)
  const nearPos = [ 32, 0 ]
  const nearToFarDelta = [ 32, 0 ]
  assert.equal(aabbSegOverlap(aabb, nearPos, nearToFarDelta), false)
}

// should work when segment is axis aligned
{
  // When the segment is axis aligned, it will cause the near and far values
  // to be Infinity and -Infinity. Make sure that this case works.
  aabb.width = aabb.height = 32

  const pos = [ -32, 0 ]
  const delta = [ 64, 0 ]
  assert.equal(aabbSegOverlap(aabb, pos, delta, 0, 0, hit), true)
  assert.equal(hit.time, 0.25)
  assert.equal(hit.normal[0], -1)
  assert.equal(hit.normal[1], 0)
}
