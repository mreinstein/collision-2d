// compute the area of a triangle given it's 3 vertices
export default function triangleArea (a, b, c) {
    const ax = b[0] - a[0]
    const ay = b[1] - a[1]
    const bx = c[0] - a[0]
    const by = c[1] - a[1]
    return bx*ay - ax*by
}
