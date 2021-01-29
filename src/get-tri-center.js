export default function getTriangleCenter (out, v0, v1, v2) {
	out[0] = (v0[0] + v1[0] + v2[0]) / 3
	out[1] = (v0[1] + v1[1] + v2[1]) / 3
	return out
}
