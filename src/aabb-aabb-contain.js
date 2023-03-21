// returns true if A fully contains B (B is fully inside of the bounds of A)
export default function aabbAABBContain (a, b) {
	// B extends to the left of A
	if (b.position[0] - (b.width/2) < a.position[0] - (a.width/2))
		return false

	// B extends to the right of A
	if (b.position[0] + (b.width/2) > a.position[0] + (a.width/2))
		return false

	// B extends above A
	if (b.position[1] - (b.height/2) < a.position[1] - (a.height/2))
		return false

	// B extends below A
	if (b.position[1] + (b.height/2) > a.position[1] + (a.height/2))
		return false

	return true
}
