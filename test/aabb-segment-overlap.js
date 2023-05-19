import assert         from './_assert.js'
import aabbSegOverlap from '../src/aabb-segment-overlap.js'


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
